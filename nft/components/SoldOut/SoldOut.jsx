import React, { useEffect, useState } from "react";
import { Flex, Text, chakra } from "@chakra-ui/react";

const SoldOut = (props) => {
    return (
        <Flex direction="column" align="center">
            <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>Public Sale is finished</Text>
            <Text fontSize="1.5rem"><chakra.span fontWeight="bold">NFTs sold : <chakra.span color="orange">{props.totalSupply}</chakra.span></chakra.span> / 5455</Text>
        </Flex>
    )
}

export default SoldOut;