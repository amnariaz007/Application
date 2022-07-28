import { ChakraProvider } from "@chakra-ui/react";
import { EthersProvider } from "../context/ethersProviderContext";

function MyApp({ Component, pageProps }) {
  return (
    <EthersProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </EthersProvider>
  )
}

 
export default MyApp 



