import Gifts from "./Gifts"
import FetchData from "./FetchData"
import {Stack} from "@chakra-ui/react";

const Home = () => {


        return (
            <Stack px={[4, 8, 12, 16]} py={8}>
            <FetchData/>
            <Gifts/>
            </Stack>
        )
}

export default Home