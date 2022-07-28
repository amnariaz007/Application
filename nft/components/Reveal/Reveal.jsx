import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";

const Reveal = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [seconds, setSeconds] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [hours, setHours] = useState(null);
    const [days, setDays] = useState(null);

    let revealTime = 1658644627;

    useEffect(() => {
        getCount()
    }, [])

    const getCount = () => {
        setIsLoading(true);
        var calc = setInterval(function() {
            let unixTime = revealTime * 1000;
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
            {days >= 0 ? (
                <Flex direction="column" align="center">
                    <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>Reveal is in</Text>
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
                    <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>The collection has been revealed!</Text>
                </Flex>
            )}
        </Flex>
    )
}

export default Reveal;