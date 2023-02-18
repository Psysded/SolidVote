import {
    Box, Button, Center, FormControl, FormLabel, Input, Text, Flex, Heading
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {useState} from "react";


export default function CreateAPoll() {
    const [name, setName] = useState("");
    const [participant, setParticipant] = useState("");
    const [participants, setParticipants] = useState([]);

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
