import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    Text,
    Flex,
    Card,
    StatGroup,
    StatLabel,
    Stat,
    StatNumber,
    StatHelpText, StatArrow, Heading, CardBody, Divider
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {useState} from "react";


export default function PollsResults() {
    const [name, setName] = useState("");

    return (
        <Box>
            <Nav/>
            <Box h="90vh">
                <Text fontSize="5xl" h="10vh" pt="10" display="flex" justifyContent="center">Previous poll</Text>
                <Flex pt="50" px="5vw" direction="row" justifyContent="center" alignItems="center" wrap="wrap">
                    <Card mx="5">
                        <CardBody>
                            <Heading size='xl'>Do you like web3 ?</Heading>
                            <Divider py="2"/>
                            <Center py="2"><Text>Result :</Text></Center>
                            <StatGroup display="flex" justifyContent="center" alignItems="center">
                                <Stat display="flex" justifyContent="center" alignItems="center">
                                    <StatLabel>Yes</StatLabel>
                                    <StatNumber>XXX</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type='increase'/>
                                        99.5%
                                    </StatHelpText>
                                </Stat>
                                <Stat display="flex" justifyContent="center" alignItems="center">
                                    <StatLabel>No</StatLabel>
                                    <StatNumber>XXX</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type='decrease'/>
                                        0.5%
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                        </CardBody>
                    </Card>
                    <Card mx="5">
                        <CardBody>
                            <Heading size='xl'>Do you like web3 ?</Heading>
                            <Divider py="2"/>
                            <Center py="2"><Text>Result :</Text></Center>
                            <StatGroup display="flex" justifyContent="center" alignItems="center">
                                <Stat display="flex" justifyContent="center" alignItems="center">
                                    <StatLabel>Yes</StatLabel>
                                    <StatNumber>XXX</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type='increase'/>
                                        99.5%
                                    </StatHelpText>
                                </Stat>
                                <Stat display="flex" justifyContent="center" alignItems="center">
                                    <StatLabel>No</StatLabel>
                                    <StatNumber>XXX</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type='decrease'/>
                                        0.5%
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                        </CardBody>
                    </Card>
                </Flex>
            </Box>
        </Box>
    );
}
