import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
} from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"

export default function WelcomePage() {
        const navigate = useNavigate()
    return (
        <Container maxW={'5xl'}>
            <Stack
                textAlign={'center'}
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}>
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}>
                    Seznam dárků{' '}
                    <Text as={'span'} color={'orange.400'}>
                        snadno a rychle
                    </Text>
                </Heading>
                <Text color={'gray.500'} maxW={'3xl'}>
                    Už se nemusíte trápit rozesíláním odkazů na dárky, psaním seznamů či aktualizací
                    dostupnosti. Ať jde o dárky k Vánocům nebo seznam svatebních darů, o vše se postaráme!
                </Text>
                <Stack spacing={6} direction={'row'}>
                    <Button
                        rounded={'full'}
                        px={6}
                        colorScheme={'orange'}
                        bg={'orange.400'}
                        _hover={{ bg: 'orange.500' }}
                        onClick={() => {navigate("/login")}}>
                        Přihlaste se
                    </Button>
                    <Button
                        rounded={'full'} px={6}
                        onClick={() => {navigate("/signup")}}>
                        Zaregistrujte se
                    </Button>
                </Stack>
            </Stack>
        </Container>
    )
}