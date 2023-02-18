import {
    Box, Button, Center, Flex, FormControl, FormLabel, Input, Text,
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";
import {Link, useParams} from "react-router-dom";
import {useState} from "react";


export default function Vote() {
    const { id = "" }= useParams();
    const [instance, setInstance] = useState(id);
    let display = <></>;

    if (id !== "") {
        display = <Box><Flex alignItems="center" justifyContent="center"><Text fontSize="4xl">Do you like web3 ?</Text></Flex><Flex direction="row" alignItems="center" justifyContent="center" mt="100">

            <Button colorScheme="red" mr="25"><Link to="/">No</Link></Button>
            <Button colorScheme="green" mr="25"><Link to="/">Yes</Link></Button>
            </Flex></Box>
    } else {
        display = <Flex direction="column" alignItems="center" justifyContent="center">
            <Text fontSize="5xl" h="20%" pt="10" display="flex" justifyContent="center">Vote</Text>
            <FormControl my="5">
                <FormLabel>Poll's ID</FormLabel>
                <Input placeholder="0x..." onChange={(e) => setInstance(e.target.value)} value={instance}/>
            </FormControl>
            <Button>Ask</Button>
        </Flex>
    }

    return (
        <Box>
            <Nav/>
            <Box>
                <Center h="90vh">
                        {display}
                </Center>
            </Box>
        </Box>
    );
}
