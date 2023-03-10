import {
    Box, Button, Center, FormControl, FormLabel, Input, Text, Flex, Heading, Alert, AlertIcon, AlertTitle
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {useNavigate} from "react-router-dom";


export default function CreateAPoll() {
    // CHECK IF CONNECTED
    const [creatorAccount, setCreatorAccount] = useState("");
    const navigate = useNavigate();
    // NAME OF THE POLL
    const [name, setName] = useState("");
    // NEW PARTICIPANT
    const [participant, setParticipant] = useState("");
    // PARTICPANTS LISTS
    const [participants, setParticipants] = useState([]);
    let alert = <></>;

    // CHECK IF USER IS CONNECTED // REDIRECT IF NOT
    useEffect(() => {
        const fetchWallet = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({method: 'eth_requestAccounts'});
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCreatorAccount(address);
                } catch (err) {
                    console.error(err);
                    alert = <Alert status='error'>
                        <AlertIcon/>
                        <AlertTitle>{err.message}</AlertTitle>
                    </Alert>;
                    navigate("/");
                }
            } else {
                console.error('Please install MetaMask to use this dApp!');
                alert = <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>Please install MetaMask to use this dApp!</AlertTitle>
                </Alert>;
                navigate("/");
            }
        }
        fetchWallet();
    }, [])

    function addParticipants() {
        if (participant === "")
            return;
        setParticipants((participants) => [...participants, participant]);
        console.log(participants);
        setParticipant("");
    }

    function removeParticipants(name) {
        setParticipants(participants.filter(address => address !== name));
    }

    return (
        <Box>
            <Nav/>
            <Box h="90vh">
                <Text fontSize="5xl" h="10%" pt="10" display="flex" justifyContent="center">Create a New Poll</Text>
                <Flex h="70%" direction="row" alignItems="center" justifyContent="center">
                    <Flex direction="column" alignItems="center" justifyContent="center" mx="10" w="30vw">
                        <FormControl my="5">
                            <FormLabel>Poll's Question</FormLabel>
                            <Input placeholder="Do you like web3 ?" onChange={(e) => setName(e.target.value)}
                                   value={name}/>
                            <FormLabel mt="5">Poll's Deadline</FormLabel>
                            <Input
                                placeholder="Select Date and Time"
                                size="md"
                                type="datetime-local"
                            />
                            <FormLabel mt="5">Add participant</FormLabel>
                            <Input placeholder="Participant address" onChange={(e) => setParticipant(e.target.value)}
                                   value={participant}/>
                            <Button mt="5" onClick={addParticipants}>Add Participant</Button>
                            <Center>
                                <Button mt="10">Create</Button>
                            </Center>
                        </FormControl>
                    </Flex>
                    <Flex direction="column" alignItems="center" justifyContent="start" mx="10" w="40vw" minH="400" maxH="600">
                        <Heading size="2xl" mb="25">Participants</Heading>
                        {participants.map((people, i) => (
                            <Flex direction="row" justifyContent="center" alignItems="center" my="2">
                                <Text>{people}</Text><Button ml="15" onClick={() => removeParticipants(people)}>Delete</Button>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}
