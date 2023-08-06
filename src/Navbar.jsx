import SignOut from "./SignOut"
import {Box, Text, HStack, Button} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const Navbar = () => {

    return (
        <Box display={'flex'}
            align-items={'center'}
             borderBottomWidth={'1px'}
             borderBottomStyle={'solid'}
             borderBottomColor={'grey.200'}
            padding={'10px'}
             mx={[2, 4, 6, 8]}>

            <a href="/home"><Text fontSize='5xl' color={'orange.400'} as='b' _hover={{color: 'orange.500'}}>Wishlist</Text></a>
            <HStack paddingStart={'40px'} spacing={'1.5rem'} >
                <Button as={RouterLink} to="/home" variant="link" >
                    <Text fontWeight={'normal'} fontSize='lg'>Dárky</Text>
                </Button>
                <Button as={RouterLink} to="/users" variant="link" >
                    <Text fontWeight={'normal'} fontSize='lg'>Uživatelé</Text>
                </Button>
                <Button variant="link">
                    <Text fontWeight={'normal'} fontSize='lg'><SignOut /></Text>
                </Button>

            </HStack>
        </Box>
    )
}

export default Navbar