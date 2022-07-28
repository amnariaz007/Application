import { Flex } from "@chakra-ui/react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


const Layout = (props) => {
    return (
        <>
            <Flex 
                w="100%"
                h="100%"
                minH="100vh"
                bgColor="#f0f0f0"
                color="#262626"
                fontFamily="Arial, sans-serif"
                flexDir="column"
                alignItems="stretch"
            >
                <Header />
                <Flex 
                    align="center"
                    justify="center"
                    flexDir="column"
                    w="100%"
                    flex={1}
                >
                    {props.children}
                </Flex>
                <Footer />
            </Flex>
        </>
    )
}

export default Layout;