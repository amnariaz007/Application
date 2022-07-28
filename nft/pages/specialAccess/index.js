import useEthersProvider from "../../hooks/useEthersProvider";
import { Flex, Text, Spinner, useToast, Image } from "@chakra-ui/react"
import Layout from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import Contract from "../../artifacts/contracts/SocietyERC721A.sol/SocietyERC721A.json";
import { ethers } from "ethers";


const specialAccess = () => {

    const { account, provider, setAccount } = useEthersProvider();

    const [isLoading, setIsLoading] = useState(false)
    const [userNFTs, setUserNFTs, , ] = useState([])

    const toast = useToast();
    const contractAddress = "0xb54DAB3C30caEbBEb214Ed80FE8E1fcc452Bf371";

    

    useEffect(() => {
        if(account) {
            getNFTs()
        };
        
        
    }, [account])

    const getNFTs = async() => {


        setIsLoading(true)
        const contract = new ethers.Contract(contractAddress, Contract.abi, provider)

        let userNFTs = await contract.tokensOfOwner(account)
        setUserNFTs(userNFTs)
        setIsLoading(false)

    }
   
    
    

    return (
        
        <Layout>
            {account ? (
                isLoading ? (
                    <Spinner />
                ) : (
                    
                    userNFTs.length > 0 ? (
                        
                        <Flex align="center" justify="center" direction="column"><text>ola</text></Flex>
                        
                    ) :  (
                        
                        <Text>You have no NFTs of this collection on your wallet.</Text>
                    )
                )
            ) : (
                

                <Text>Please connect your wallet</Text>
            )}
        </Layout>
    )
}

export default specialAccess;