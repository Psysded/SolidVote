import {
    Alert, AlertIcon, AlertTitle,
    Box, Button, Center, Flex, FormControl, FormLabel, Input, Text,
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import DisplayAvailableVote from "../components/MainPart/DisplayAvailableVote";


// POSSIBILITE DE MAXI REFACTO AVEC POLLSRESULTS
export default function Vote() {
    // CHECK IF CONNECTED
    const [creatorAccount, setCreatorAccount] = useState("");
    const navigate = useNavigate();
    // USER INPUT COMMITMENT
    const [identity, setIdentity] = useState("");
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
                    <AlertIcon/>
                    <AlertTitle>Please install MetaMask to use this dApp!</AlertTitle>
                </Alert>;
                navigate("/");
            }
        }
        fetchWallet();
    }, [])

    // CHECK IDENTITY VALUE & IF COMMITMENT VALUE VALIDATED : DISPLAYAVAILABLESVOTES
    if (identity === "" || save === false) {
        display = <Center ml="25%" w="50%" mt="100"><Flex justifyContent="center" alignItems="center" direction="column">
            <FormControl my="5">
                <Input placeholder="Your secret identity" onChange={(e) => setIdentity(e.target.value)} value={identity}/>
                <Center mt="25">
                    <Button onClick={() => setSave(true)}>Save</Button>
                </Center>
                <Text>Don't have one ? Generate</Text>
                <Text></Text>
            </FormControl></Flex></Center>
    } else {
        display = <DisplayAvailableVote identity={identity}/>
    }

    return (
        <Box>
            <Nav/>
            <Box h="90vh">
                <Text fontSize="5xl" h="10%" pt="10" display="flex" justifyContent="center">Vote</Text>

                {display}

            </Box>
        </Box>
    );
}
