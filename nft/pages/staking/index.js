import useEthersProvider from "../../hooks/useEthersProvider";
import { Flex, Text, Spinner, useToast, Image } from "@chakra-ui/react"
import Layout from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import Contract from "../../artifacts/contracts/SocietyERC721A.sol/SocietyERC721A.json";
import Contract1 from "../../artifacts/contracts/NFTStaking.sol/nFTStaking.json";
import { ethers } from "ethers";


const specialAccess = () => {

    const { account, provider, setAccount } = useEthersProvider();

    const [isLoading, setIsLoading] = useState(false)
    const [userNFTs, setUserNFTs, , ] = useState([])

    const toast = useToast();
    const contractAddress = "0xb54DAB3C30caEbBEb214Ed80FE8E1fcc452Bf371";
    const contractStackAddress = "0xc065c5D916D90ba5F901F171621d482d4C8DEc00";

    

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
                        
                        <Flex align="center" justify="center" direction="column"></Flex>
                        
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