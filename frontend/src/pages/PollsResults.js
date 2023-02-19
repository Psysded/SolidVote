import {
    Box,
    Center,
    Text,
    Flex,
    Alert, AlertIcon, AlertTitle, FormControl, Input, Button
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {ethers} from "ethers";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DisplayPollsResults from "../components/MainPart/DisplayPollsResults";
import {createIdentity} from "../service/Identity";

// POSSIBILITE DE MAXI REFACTO AVEC VOTE
export default function PollsResults() {
    // CHECK IF CONNECTED
    const [creatorAccount, setCreatorAccount] = useState("");
    const navigate = useNavigate();
    // USER INPUT COMMITMENT
    const [commitment, setCommitment] = useState("");
    const [save, setSave] = useState(false);
    let display = <></>;

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
    }, []);

    // CHECK COMMITMENT VALUE & IF COMMITMENT VALUE VALIDATED : DISPLAYPOLLSRESULTS
    if (commitment === "" || save === false) {
        display = <Center ml="25%" w="50%" mt="100"><Flex justifyContent="center" alignItems="center" direction="column">
            <FormControl my="5">
                <Input placeholder="Your commitment" onChange={(e) => setCommitment(e.target.value)} value={commitment}/>
                <Center mt="25">
                    <Button onClick={() => setSave(true)}>Save</Button>
                </Center>
                <Text>Don't have one ? Generate</Text>
            </FormControl></Flex></Center>
    } else {
        display = <DisplayPollsResults commitment={commitment}/>
    }


    return (
        <Box>
            <Nav/>
            <Box h="90vh">
                <Text fontSize="5xl" h="10vh" pt="10" display="flex" justifyContent="center">Previous poll</Text>
                {display}
            </Box>
        </Box>
    );
}
