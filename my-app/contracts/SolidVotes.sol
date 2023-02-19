//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

/// SolidVotes voting contract using Semaphore.
/// It allows users to vote anonymously in a poll.
/// The following code allows you to create polls, add voters and allow them to vote anonymously.
interface ISolidVoting {
    error Semaphore__CallerIsNotThePollCoordinator();
    error Semaphore__MerkleTreeDepthIsNotSupported();
    error Semaphore__PollHasAlreadyBeenStarted();
    error Semaphore__PollIsNotOngoing();
    error Semaphore__YouAreUsingTheSameNillifierTwice();
    error Semaphore__PollHasEnded();
    error Semaphore__Invalid();
    error Semaphore__UserIsNotRegistered();

    enum PollState {
        Created,
        Ongoing,
        Ended
    }

    struct Verifier {
        address contractAddress;
        uint256 merkleTreeDepth;
    }

    struct Poll {
        address coordinator;
        PollState state;
        mapping(uint256 => bool) nullifierHashes;
        uint256 endTimeStamp;
        string title;
        string[] options;
        mapping(string => uint256) votesPerOption;
    }

    /// @dev Emitted when a new poll is created.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    event PollCreated(uint256 pollId, address indexed coordinator);

    /// @dev Emitted when a poll is started.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    /// @param endTimeStamp: Timestamp when the poll ends.
    event PollStarted(uint256 pollId, address indexed coordinator, uint256 endTimeStamp);

    /// @dev Emitted when a user votes on a poll.
    /// @param pollId: Id of the poll.
    /// @param vote: User encrypted vote.
    event VoteAdded(uint256 indexed pollId, uint256 vote);

    /// @dev Emitted when a poll is ended.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    event PollEnded(uint256 pollId, address indexed coordinator);

    /// @dev Creates a poll and the associated Merkle tree/group.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    /// @param merkleTreeDepth: Depth of the tree.
    function createPoll(
        uint256 pollId,
        address coordinator,
        uint256 merkleTreeDepth,
        uint256 endTimeStamp,
        string calldata title,
        string[] calldata options
    ) external;

    /// @dev Adds a voter to a poll.
    /// @param pollId: Id of the poll.
    /// @param identityCommitment: Identity commitment of the group member.
    function addVoter(uint256 pollId, uint256 identityCommitment) external;

    /// @dev Starts a pull and publishes the key to encrypt the votes.
    /// @param pollId: Id of the poll.
    function startPoll(uint256 pollId) external;

    /// @dev Casts an anonymous vote in a poll.
    /// @param vote: Encrypted vote.
    /// @param nullifierHash: Nullifier hash.
    /// @param pollId: Id of the poll.
    /// @param proof: Private zk-proof parameters.
    function castVote(
        uint256 vote,
        uint256 nullifierHash,
        uint256 pollId,
        uint256[8] calldata proof
    ) external;

    /// @dev Ends a pull and publishes the key to decrypt the votes.
    /// @param pollId: Id of the poll.
    function endPoll(uint256 pollId) external;
}

contract SolidVotes is ISolidVoting, SemaphoreGroups {
    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    ISemaphoreVerifier public verifier = ISemaphoreVerifier(0x66e772B0B8Ee1c24E4b6aC99A3A82C77f431792E);


    // ||||||||||||||||||||||||||||||| VOTING PART |||||||||||||||||||||||||||||||||||||||


    /// Gets a poll id and returns the poll data.
    mapping(uint256 => Poll) internal polls;

    /// @dev Checks if the poll coordinator is the transaction sender.
    /// @param pollId: Id of the poll.
    modifier onlyCoordinator(uint256 pollId) {
        if (polls[pollId].coordinator != _msgSender()) {
            revert Semaphore__CallerIsNotThePollCoordinator();
        }
        _;
    }

    modifier pollEnded(uint256 pollId) {
        if (block.timestamp >= polls[pollId].endTimeStamp) {
            revert Semaphore__PollHasEnded();
        }
        polls[pollId].state = PollState.Ended;
        _;
    }

    /// @dev See {ISolidVoting-createPoll}.
    function createPoll(
        uint256 pollId,
        address coordinator,
        uint256 merkleTreeDepth,
        uint256 endTimeStamp,
        string calldata title,
        string[] calldata options
    ) public override PollEnded(pollId) {
        if (merkleTreeDepth < 16 || merkleTreeDepth > 32) {
            revert Semaphore__MerkleTreeDepthIsNotSupported();
        }
        if (options.length < 2 || options.length > 10) {
            revert Semaphore__Invalid();
        }
        _createGroup(pollId, merkleTreeDepth);
        polls[pollId].coordinator = coordinator;
        polls[pollId].endTimeStamp = endTimeStamp;
        polls[pollId].title = title;
        for (uint256 i = 0; i < options.length; i++) {
            polls[pollId].options.push(options[i]);
            polls[pollId].votesPerOption[options[i]] = 0;
        }


        emit PollCreated(pollId, coordinator);

        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        polls[pollId].state = PollState.Ongoing;

        emit PollStarted(pollId, _msgSender());
    }

    /// @dev See {ISolidVoting-addVoter}.
    function addVoter(uint256 pollId, uint256 identityCommitment) public override onlyCoordinator(pollId) PollEnded(pollId) {
        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        _addMember(pollId, identityCommitment);
    }

    /// @dev add multiple voters to a poll
    /// @param pollId: Id of the poll.
    /// @param identityCommitments: Identity commitments of the voters.
    function addVoters(uint256 pollId, uint256[] calldata identityCommitments) external {
        for (uint256 i = 0; i < identityCommitments.length; i++) {
            addVoter(pollId, identityCommitments[i]);
        }
    }

    /// @dev See {ISolidVoting-castVote}.
    function castVote(
        uint256 vote,
        uint256 nullifierHash,
        uint256 pollId,
        uint256[8] calldata proof
    ) public override PollEnded(pollId) {
        if (polls[pollId].state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        if (polls[pollId].nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNillifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(pollId);
        uint256 merkleTreeRoot = getMerkleTreeRoot(pollId);

        verifier.verifyProof(merkleTreeRoot, nullifierHash, vote, pollId, proof, merkleTreeDepth);

        polls[pollId].nullifierHashes[nullifierHash] = true;
        polls[pollId].votesPerOption[polls[pollId].options[vote]] += 1;
        
        emit VoteAdded(pollId, vote);
    }

    /// @dev See {ISolidVoting-publishDecryptionKey}.
    // function endPoll(uint256 pollId, uint256 decryptionKey) public override onlyCoordinator(pollId) {
    //     if (polls[pollId].state != PollState.Ongoing) {
    //         revert Semaphore__PollIsNotOngoing();
    //     }

    //     polls[pollId].state = PollState.Ended;

    //     emit PollEnded(pollId, _msgSender());
    // }

    /// @dev Gets the poll results.
    /// @param pollId: Id of the poll.
    function getPollResults(uint256 pollId) public view pollEnded returns (uint256[] memory) {
        uint256[] memory results = new uint256[](polls[pollId].options.length);
        for (uint256 i = 0; i < polls[pollId].options.length; i++) {
            results[i] = polls[pollId].votesPerOption[polls[pollId].options[i]];
        }
        return results;
    }

    // ||||||||||||||||||||||||||||||| USERS PART |||||||||||||||||||||||||||||||||||||||

    /// @dev Gets the user's identity commitment.
    mapping(address => uint256) public users;

    /// @dev Gets all the polls the user(commitment) is currently participating in.
    mapping(uint256 => uint256[]) public userPolls;


    /// @dev check if user identity commitment is connected to the right user address
    modifier onlyUser(uint256 identityCommitment) {
        if (users[_msgSender()] != identityCommitment) {
            revert Semaphore__UserIsNotRegistered(); // this is not the user's identity commitment he is impersonating the real user
        }
        _;
    }

    /// @dev adds a identity commitment to the user
    /// @param identityCommitment: Identity commitment of the user.
    function registerUser(uint256 identityCommitment) public {
        users[_msgSender()] = identityCommitment;
    }

    /// @dev gets the data of all the polls the user is participating in
    /// @param identityCommitment: Identity commitment of the user.
    function getUserPolls(uint256 identityCommitment) public view onlyUser(identityCommitment) returns (Poll[] memory) {
        uint256[] memory pollsIds = userPolls[identityCommitment];
        Poll[] memory pollsData = new Poll[](pollsIds.length);

        for (uint256 i = 0; i < pollsIds.length; i++) {
            pollsData[i] = polls[pollsIds[i]];
        }

        return pollsData;
    }

    /// @dev creates a poll and adds the users to it as voters from their wallet addresses
    /// @param coordinator: Address of the poll coordinator.
    /// @param endTimeStamp: Timestamp of the end of the poll.
    /// @param title: Title of the poll.
    /// @param options: Options of the poll.
    /// @param VotersAddresses: Addresses of the voters.
    /// TODO: add a check to see if the user is already registered because if not it's identity commitment will be registered with the default value of 0
    function createPollWithUsers(
        address coordinator,
        uint256 endTimeStamp,
        string calldata title,
        string[] calldata options,
        address[] calldata VotersAddresses
    ) external {
        uint256 pollId = createPoll(coordinator, endTimeStamp, title, options);

        for (uint256 i = 0; i < VotersAddresses.length; i++) {
            addVoter(pollId, users[VotersAddresses[i]]);
        }
    }
}

//                                            TO THE MOON !
//                                      ;;.
//                                     ,t;i,                 ,;;;:
//                                     :t::i,              ,;i;:,:,
//                                     11;:;i;.          .;i;:::,,:
//                                    ,1;i11i11iii;;;;::;;:,:,..,,:.
//                                  .:1ttt11i;iii1111ii;:.,:,. .,::.
//                              ,i1tfftfffti;;ii;iiiiiii;:,,.  ,:;,
//                             ;Lfffttttft1;;;i111i;;iii11i:..,:,;;
//                            .fLLLt:,,;t1i;;1tttt1ii;iii1111i;:,:1;
//                            1C00Ci. .i1t111ii;;:,:;;iii11111i;,,it.
//                           ,C00Ct1i1tttftti:. :.  ,ii11111111i;:;1,
//                           t0GGGfffftffftt1i;::,:i1tfffttttt11iii1;
//                          ,CCGC;,...,;fLftt1tt11111tfLLftffftt11i11.
//                          iGLGt       tLfftttfffLffffffLfffttt1ii11i
//                          iGLf;.    .:i1tt11ffffffLfffftt1111ii;iiit;
//                          1GLt:..  ..:iii1111ttttt1ttt1111111i;;i;i1t
//                          ;GLLt,     .,::::,:i11111t11ttfttt1i;;;;iit:
//                          .LCLft;.........,:i1111ttttttttt11i;;;;;;i1i
//                           ,LLfff1iiiiiiii111111111tttt11iii;;;;::;;it;
//                            tfffftttt1111iiiiii1ttttt111iii;;;:::;;;iti
//                           :Ltttttt1111iiiiiii1tttt111111iii;:::;iii1t1
//                           ;Lftt11111111iiiiiiii;iii11111ii;;;ii111t1f1
//                           tLffftt1ii;ii;;;;;;;;ii11111111ii1tttttttttf
//                           fCLfftt11ii;;;;;;ii11t11111tttttffffffftttt1
//                          ,LCLLfft111iiiiiii11t111ttt11tttffttfffftt11:
//                       .:1fLLLffttt11iiiiii111111111ttft1tffffffftt1ii;
//                     ,1fLLCLLffttt111iiiii11111111t1tttfftfffffftt1i;;i
//                  .:tffLCCCCLfftt1111i1i1111111t1t1111ttffffttt11ii;;;i
//                 ,fLffLGGCGCLfftt111ii11111t1tttttttt11tfffftt111i;;;;1
//                :fftfCGGLCCLLftt111ii1ii1111111tt11tttt1tttttttttti;;;t.
//                :11tLGGLfffffttt1111iiiiiiii11111111i1111tttttffft1;;;1.
//            .,;i111tCCLfftt11t11111i1ii1iiiiiii1i1ii11111ttttttfft1;:;:
//          ,:;iiiii1tLLfttftt1iiiiiiiiiiiiiiiii1iii11111i111ttttttti;;;,
//          ;;:;;;::1ffffffLLfftt111111iii1iiiii1ii111111ii11ttttttti;;i,
//          .:::::iLGftffLLLLLLfttttttt1iii11tttttt11iiiii111ttttttti;;;
//            ...;1tt1tfLLLLLLLfftt11t1ttfLCCLLLftt111iiii1111tttttt1ii.
//                    1CLLLLLLLfftttffLGGGGCLLCLft1t11iii111t111ttttt1,
//                    ,ttfffLLLLLfffLLGGLCCff11fttt11iiii11111111tt1t,
//                        ..:;itf1tfffttt;1ti;::11i;;;iiiii111111111i
//                              ..:1t1;::...:;, :1tfi,;ii;ii1111ii;i.
//                                  ..,;;:.....;11tLL;:,:::;;;iiii;:
//                                      ,;... .:,:i;1i,         ...
//                                               ....,
