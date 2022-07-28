import React, { useEffect, useState } from "react";
import { Image, Button, Flex, Spinner, useToast, chakra, Text } from "@chakra-ui/react";
import useEthersProvider from "../../hooks/useEthersProvider";
import { ethers } from "ethers";
import Contract from "../../artifacts/contracts/SocietyERC721A.sol/SocietyERC721A.json";
import tokens from "../../tokens.json";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const WhitelistSale = (props) => {

    const { account, provider } = useEthersProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [mintIsLoading, setMintIsLoading] = useState(false);
    const [seconds, setSeconds] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [hours, setHours] = useState(null);
    const [days, setDays] = useState(null);
    const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));

    const saleStartTime = 1660810300;
    const endSaleTime = saleStartTime + 12 * 3600;

    const toast = useToast();
    const contractAddress = "0xb54DAB3C30caEbBEb214Ed80FE8E1fcc452Bf371"

    useEffect(() => {
        getCount()
    }, [])

    const mint = async() => {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Contract.abi, signer);

        let tab = [];
        tokens.map((token) => {
            tab.push(token.address);
        });
        let leaves = tab.map((address) => keccak256(address));
        let tree = new MerkleTree(leaves, keccak256, { sort: true });
        let leaf = keccak256(account);
        let proof = tree.getHexProof(leaf);

        let overrides = {
            value: props.BNWlSalePrice
        }

        try {
            let transaction = await contract.whitelistMint(account, 1, proof, overrides);
            setMintIsLoading(true)
            await transaction.wait();
            setMintIsLoading(false);
            toast({
                description: "Congratulations! You have minted your NFT!",
                status: "success",
                duration: 4000,
                isClosable: true
            });
            props.getDatas();
        }
        catch {
            toast({
                description: "Oops... an error occured",
                status: "error",
                duration: 4000,
                isClosable: true
            });
        }
    }

    const getCount = () => {
        setIsLoading(true);
        var calc = setInterval(function() {
            let unixTime = saleStartTime * 1000;
            let date_future = new Date(unixTime);
            let date_now = new Date();

            let seconds = Math.floor((date_future - (date_now)) / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);
            
            hours = hours-(days * 24);
            minutes = minutes-(days * 24 * 60)-(hours * 60);
            seconds = seconds-(days * 24 * 60 * 60)-(hours * 60 * 60)-(minutes * 60);
    
            setDays(days)
            setHours(hours)
            setMinutes(minutes)
            setSeconds(seconds)
            setIsLoading(false);
        }, 1000);
    }

    return (
        <Flex>
            {isLoading ? (
                <Spinner />
            ) : (
                <Flex>
                    {days >= 0 ? (
                        <Flex direction="column" align="center">
                            <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>Whitelist Sale starts in</Text>
                            <Flex align="center" justify="center" p="2rem">
                                <Flex direction="column" justify="center" align="center" p={["1rem", "1rem", "2rem", "2rem"]}>
                                    <Text fontWeight="bold" fontSize={["2rem", "2rem", "5rem", "5rem"]}>{days}</Text>
                                    <Text fontStyle="italic">Days</Text>
                                </Flex>
                                <Flex direction="column" justify="center" align="center" p={["1rem", "1rem", "2rem", "2rem"]}>
                                    <Text fontWeight="bold" fontSize={["2rem", "2rem", "5rem", "5rem"]}>{hours}</Text>
                                    <Text fontStyle="italic">Hours</Text>
                                </Flex>
                                <Flex direction="column" justify="center" align="center" p={["1rem", "1rem", "2rem", "2rem"]}>
                                    <Text fontWeight="bold" fontSize={["2rem", "2rem", "5rem", "5rem"]}>{minutes}</Text>
                                    <Text fontStyle="italic">Mins</Text>
                                </Flex>
                                <Flex direction="column" justify="center" align="center" p={["1rem", "1rem", "2rem", "2rem"]}>
                                    <Text fontWeight="bold" fontSize={["2rem", "2rem", "5rem", "5rem"]}>{seconds}</Text>
                                    <Text fontStyle="italic">Secs</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    ) : (
                        <Flex>
                            {timestamp > endSaleTime ? (
                                <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>Whitelist Sale is finished</Text>
                            ) : (
                                <Flex>
                                    {mintIsLoading ? (
                                        <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}><Spinner /> Processing mint...</Text>
                                    ) : (
                                        <Flex>
                                            {props.totalSupply >= 20 ? (
                                                <Flex>
                                                    <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>Whitelist sale is SOLD OUT</Text>
                                                </Flex>
                                            ) : (
                                                <Flex p="2rem" align="center" direction={["column", "column", "row", "row"]}>
                                                    <Flex width={["100%", "100%", "50%", "50%"]} align="center" direction="column">
                                                        <Text fontWeight="bold" fontSize={["2rem", "2rem", "3rem", "4rem"]}>Whitelist Sale</Text>
                                                        <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>
                                                            <chakra.span fontWeight="bold">NFTs sold : </chakra.span> 
                                                            <chakra.span fontWeight="bold" color="purple">{props.totalSupply} / 20</chakra.span>
                                                        </Text>
                                                        <Text fontSize="1.5rem">
                                                            <chakra.span fontWeight="bold">Price : </chakra.span>
                                                            <chakra.span color="purple" fontWeight="bold">{props.wlSalePrice} Eth </chakra.span>/ NFT
                                                        </Text>
                                                        <Flex mt="2rem">
                                                            <Button colorScheme="purple" onClick={mint}>
                                                                Buy 1 NFT
                                                            </Button>
                                                            <Button colorScheme="purple" onClick={() => mint(2)} ml="2rem">
                                                                Buy 2 NFT
                                                        </Button>
                                                        </Flex>
                                                    </Flex>
                                                    <Flex width={["100%", "100%", "50%", "50%"]} justify="center" align="center" p={["2rem", "2rem", "0", "0"]}>
                                                        <Image src="../../../public/mintImage.png" width="60%" />
                                                    </Flex>
                                                </Flex>
                                            )}
                                        </Flex>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    )}
                </Flex>
            )}
        </Flex>
    )
}

export default WhitelistSale;