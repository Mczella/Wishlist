import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    InputRightElement,
    InputGroup,
    Box,
    Text,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, {useContext, useState} from "react"
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "./firebase"
import {useNavigate} from "react-router-dom"
import {AuthorizationContext} from "./AuthorizationContext"
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons';
import {PrimaryButton} from "./Styles/Buttons";


const Login = () => {
    const [error, setError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const {dispatch, rememberMe, setRememberMe} = useContext(AuthorizationContext)

    // add forgot password link

    const handleLogin = async (e) => {
        e.preventDefault()
        // add option remember me
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if (rememberMe) {
                localStorage.setItem("user", JSON.stringify(user))
            } else {
                sessionStorage.setItem("user", JSON.stringify(user))
            }

            dispatch({type: "LOGIN", payload: user})
            navigate("/home")
        } catch (error) {
            setError(true)
            console.log(error)
        }
    }
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'gray.200'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Přihlaste se
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        a usnadněte si život
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'white'}
                    boxShadow={'lg'}
                    p={8}>

                    <form onSubmit={handleLogin}>
                        <Stack spacing={4}>

                            <FormControl id="email">
                                <FormLabel>E-mail</FormLabel>
                                <Input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl id="password">
                                <FormLabel>Heslo</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <FormErrorMessage>Zadejte heslo.</FormErrorMessage>
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        >
                                            {showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            <Stack spacing={6}>
                                <Stack
                                    direction={{base: 'column', sm: 'row'}}
                                    align={'start'}
                                    justify={'space-between'}
                                    pt={2}
                                >
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    >
                                        Zapamatujte si mě.
                                    </Checkbox>
                                    <Link color={'blue.500'}>Zapomněli jste heslo?</Link>
                                </Stack>
                                <Stack spacing={2} pt={2}>
                                    <PrimaryButton type="submit">
                                        Přihlásit
                                    </PrimaryButton>
                                    {error && <Text fontSize='xs' color='red'>Špatný e-mail nebo heslo.</Text>}
                                </Stack>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}

export default Login