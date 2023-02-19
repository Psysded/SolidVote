import {
    Box,
    Card,
    CardBody,
    Center,
    Divider,
    Heading,
    Stat, StatArrow,
    StatGroup, StatHelpText,
    StatLabel, StatNumber,
    Text,
} from '@chakra-ui/react';

export default function DisplayAvailableVote({identity}) {
    return (
        <Box>
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
        </Box>
    );
}
