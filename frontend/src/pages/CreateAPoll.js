import {
    Box, Button, Center, FormControl, FormLabel, Input, Text, Flex
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {useState} from "react";


export default function CreateAPoll() {
    const [name, setName] = useState("");

    return (
        <Box>
            <Nav/>
            <Box h="90vh">
                <Text fontSize="5xl" h="10%" pt="10" display="flex" justifyContent="center">Create a New Poll</Text>
                <Center h="70%">
                    <Flex direction="column" alignItems="center" justifyContent="center">
                        <FormControl my="5">
                            <FormLabel>Poll's Question</FormLabel>
                            <Input placeholder="Do you like web3 ?" onChange={(e) => setName(e.target.value)} value={name}/>
                            <FormLabel mt="5">Poll's Deadline</FormLabel>
                            <Input
                                placeholder="Select Date and Time"
                                size="md"
                                type="datetime-local"
                            />
                            <FormLabel mt="5">Add participant</FormLabel>
                            <Input placeholder="Participant address" onChange={(e) => setName(e.target.value)} value={setName}/>
                            <Button mt="5">Add Participant</Button>
                            <Center>
                                <Button mt="10">Create</Button>
                            </Center>
                        </FormControl>
                    </Flex>
                </Center>
            </Box>
        </Box>
    );
}
