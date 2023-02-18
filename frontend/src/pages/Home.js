import {
    Text, Box,
    Stack,
    Center,
    Heading, Flex, Image
} from '@chakra-ui/react';
import Nav from "../components/Navigation/NavBar";

export default function Home() {
    return (
        <Box>
            <Nav/>
            <Stack align='stretch' h="92vh">
                <Center>
                    <Flex direction="column" w="80%" justifyContent="center" alignItems="center">
                        <Heading
                            fontSize='7xl'
                            fontWeight='extrabold'
                            h="100%"
                            mb="150">
                            Welcome to SolidVote
                        </Heading>
                        <Flex direction="row">
                            <Box w="50%" pr="5%">
                                <Text fontSize="4xl">What is SolidVote ?</Text>
                                <Text mt="10">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam purus nibh,
                                    egestas ac tortor in, vestibulum condimentum dolor. Praesent porta vitae purus sed
                                    scelerisque. In sapien ligula, mattis ut ex nec, mattis rutrum justo. Nullam dapibus
                                    rutrum rutrum. Morbi sagittis et dui venenatis cursus. Ut ornare nibh vitae mauris
                                    faucibus sollicitudin semper quis turpis. Proin massa arcu, fermentum vel interdum
                                    in, ornare in eros. Suspendisse molestie molestie pharetra. Nulla eu sapien
                                    tristique, commodo urna vestibulum, cursus ipsum. Morbi rhoncus sapien ut lectus
                                    malesuada egestas. &</Text>
                            </Box>
                            <Flex justifyContent="center" alignItems="center" w="50%" pl="5%">
                                <Image htmlHeight="250px"
                                       htmlWidth="450px"
                                       src="data:image/png;base64,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"
                                       alt="vote"/>
                            </Flex>
                        </Flex>
                    </Flex>
                </Center>
            </Stack>
        </Box>
    );
}
