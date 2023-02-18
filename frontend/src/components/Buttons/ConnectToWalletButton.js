import {
    Alert,
    AlertIcon,
    AlertTitle,
    Button, Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton, PopoverContent,
    PopoverHeader, PopoverTrigger, Portal, Text
} from "@chakra-ui/react";
import { ethers } from 'ethers';
import {useEffect, useState} from "react";

export default function ConnectToWalletButton() {
    const [defaultAccount, setDefaultAccount] = useState("");
    const [userBalance, setUserBalance] = useState(null);
    let alert = <></>;
    let display = <></>;

    useEffect(() => {
        if(!window.ethereum) return

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        accountChangedHandler(signer, provider);
    })

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                accountChangedHandler(signer, provider);
            } catch (err) {
                console.error(err);
                alert = <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>{err.message}</AlertTitle>
                </Alert>;
            }
        } else {
            console.error('Please install MetaMask to use this dApp!');
            alert = <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Please install MetaMask to use this dApp!</AlertTitle>
            </Alert>;
        }
    };

    const accountChangedHandler = async (newAccount, provider) => {
        const address = await newAccount.getAddress();
        setDefaultAccount(address);
        const balance = await newAccount.getBalance();
        setUserBalance(ethers.utils.formatEther(balance));
    };

    if (defaultAccount === "") {
        display = <Button mx="2" onClick={connectWallet}>Connect to Wallet</Button>;
    } else {
        display = <Popover>
                        <PopoverTrigger>
                            <Button>{defaultAccount}</Button>
                        </PopoverTrigger>
                        <Portal>
                            <PopoverContent>
                                <PopoverArrow/>
                                <PopoverHeader>Your Wallet</PopoverHeader>
                                <PopoverCloseButton/>
                                <PopoverBody>
                                    <Text>Balance : {userBalance}</Text>
                                </PopoverBody>
                            </PopoverContent>
                        </Portal>
                    </Popover>
    }

    // @ts-ignore
    return (
        <>
            {alert}
            <div>
                {display}
            </div>
        </>
    );
}