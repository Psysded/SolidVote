import {Box, Button, Flex, Stack, Text, useColorMode, useColorModeValue} from "@chakra-ui/react";
import {MoonIcon} from '@chakra-ui/icons'
import {Link} from "react-router-dom";
import ConnectToWalletButton from "../Buttons/ConnectToWalletButton";

export default function NavBar() {
    const {toggleColorMode} = useColorMode();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex alignItems={'center'} justifyContent={'space-between'} h="8vh">
                    <Flex alignItems="center" justifyContent="start">
                        <Link to={"/"}><Text fontSize="2xl" fontWeight='bold'>SolidVote</Text></Link>
                        <Link to={"/polls-results"} style={{marginLeft: 60}}><Button>Poll's result</Button></Link>
                        <Link to={"/vote"} style={{marginLeft: 20}}><Button>Vote Now</Button></Link>
                        <Link to={"/create-a-poll"} style={{marginLeft: 20}}><Button>Create new poll</Button></Link>
                    </Flex>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <ConnectToWalletButton/>
                            <Button onClick={toggleColorMode}>
                                <MoonIcon/>
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}
