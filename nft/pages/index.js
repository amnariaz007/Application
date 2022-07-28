import React, { useState, useEffect } from "react";
import { Flex, Button, Spinner, Text, useToast } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import useEthersProvider from "../hooks/useEthersProvider";
import Contract from "../artifacts/contracts/SocietyERC721A.sol/SocietyERC721A.json";
import Before from "../components/Before/Before";
import WhitelistSale from "../components/WhitelistSale/WhitelistSale";
import PublicSale from "../components/PublicSale/PublicSale";
import SoldOut from "../components/SoldOut/SoldOut";
import Reveal from "../components/Reveal/Reveal";
import { ethers } from "ethers";

export default function Home() {

  const { account, provider } = useEthersProvider();
  const [isLoading, setIsLoading] = useState(false);
  //0 : Before, 1 : WhitelistSale, 2 : PublicSale, 3 : SoldOut, 4 : Reveal 
  const [sellingStep, setSellingStep] = useState(null);
  //SaleStartTime 
  const [saleStartTime, setSaleStartTime] = useState(null)
  //WhitelistSale price 
  const [BNWlSalePrice, setBNWlSalePrice] = useState(null);
  const [wlSalePrice, setWlSalePrice] = useState(null);
  //PublicSale price 
  const [BNPublicSalePrice, setBNPublicSalePrice] = useState(null);
  const [publicSalePrice, setPublicSalePrice] = useState(null); 
  //Total Supply 
  const [totalSupply, setTotalSupply] = useState(null);

  const toast = useToast();
  const contractAddress = "0xb54DAB3C30caEbBEb214Ed80FE8E1fcc452Bf371";

  useEffect(() => {
    if(account) {
      getDatas();
    }
  }, [account])

  const getDatas = async() => {
    setIsLoading(true);
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
    const sellingStep = await contract.sellingStep();
    
    let wlSalePrice = await contract.wlSalePrice();
    let wlSalePriceBN = ethers.BigNumber.from(wlSalePrice._hex);
    wlSalePrice = ethers.utils.formatEther(wlSalePriceBN);
    
    let publicSalePrice = await contract.publicSalePrice();
    let publicSalePriceBN = ethers.BigNumber.from(publicSalePrice._hex);
    publicSalePrice = ethers.utils.formatEther(publicSalePriceBN)
    
    let totalSupply = await contract.totalSupply();
    totalSupply = totalSupply.toString();

    setSellingStep(sellingStep);
    setWlSalePrice(wlSalePrice);
    setBNWlSalePrice(wlSalePriceBN);
    setPublicSalePrice(publicSalePrice);
    setBNPublicSalePrice(publicSalePriceBN);
    setTotalSupply(totalSupply)
    setIsLoading(false);
  }

  return (
    <Layout>
      <Flex align="center" justify="center">
       {isLoading ? (
         <Spinner />
       ) : account ? (
        (() => {
          switch(sellingStep) {
            case null:
              return <Spinner />
            case 0: 
              return (
                <Before />
              )
            case 1:
              return (
                <WhitelistSale BNWlSalePrice={BNWlSalePrice} wlSalePrice={wlSalePrice} totalSupply={totalSupply} getDatas={getDatas} />
              )
            case 2:
              return (
                <PublicSale BNPublicSalePrice={BNPublicSalePrice} publicSalePrice={publicSalePrice} totalSupply={totalSupply} getDatas={getDatas} />
              )
            case 3:
              return (
                <SoldOut totalSupply={totalSupply} />
              )
            case 4: 
              return (
                <Reveal />
              )
            default:
              return (
                <Flex>Connect your Wallet</Flex>
              )
          }
        })()
       ) : (
        <Text>
          Please connect your Wallet
        </Text>
       )}
      </Flex>
    </Layout>
  )
}
