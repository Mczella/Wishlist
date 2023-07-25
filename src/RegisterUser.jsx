import React, {useContext, useState} from 'react'
import {auth, db} from "./firebase"
import {createUserWithEmailAndPassword} from "firebase/auth"
import {useNavigate, useLocation} from "react-router-dom"
import {AuthorizationContext} from "./AuthorizationContext"
import {useForm} from "react-hook-form"
import {doc, setDoc} from "firebase/firestore"
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    InputRightElement,
    InputGroup,
    Box,
    HStack,
    Text,
    FormErrorMessage,
} from '@chakra-ui/react';
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";


const RegisterUser = ({variant}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm({mode: "onBlur"})
    const navigate = useNavigate()
    const {dispatch} = useContext(AuthorizationContext)
    const [error, setError] = useState(false)
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)


    const createUser = async (data) => {
        try {
            const newUser = await createUserWithEmailAndPassword(auth, data.email, data.password, data.name)
            const user = newUser.user
            if (location.pathname === "/signup") {
                dispatch({type: "LOGIN", payload: user})
                navigate("/home")
                console.log(data)

                await setDoc(doc(db, "users", user.uid), {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    admin: true
                })
            } else {
                await setDoc(doc(db, "users", user.uid), {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    admin: false
                })
            }
        } catch (error) {
            setError(true)
            console.log(error)
        }
    }


    return (
        <Flex
            minH={variant==="modal"? "0" : '100vh'}
            align={variant==="modal"? 'baseline':'center'}
            justify={'center'}
            bg={'gray.200'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Vytvořte si účet
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        a ušetřete čas i nervy.
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'white'}
                    boxShadow={'lg'}
                    p={8}>

                    <form onSubmit={handleSubmit(createUser)}>
                        <Stack spacing={4}>
                            <FormControl id="email" isInvalid={errors.email}>
                                <FormLabel>E-mail</FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="email"
                                    required={true}
                                    {...register("email", {
                                        required: "Musíte zadat e-mail.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Zadejte správný e-mail.",
                                        }
                                    })}/>
                                <FormErrorMessage>
                                    {errors.email && 'Zadejte správný e-mail.'}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl id="password" isInvalid={errors.password}>
                                <FormLabel>Heslo</FormLabel>
                                <InputGroup>
                                    <Input
                                        name='password'
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete='off'
                                        placeholder="heslo"
                                        required={true}
                                        {...register("password", {
                                            required: "Musíte zadat heslo.",
                                            minLength: {
                                                value: 8,
                                                message: "Heslo musí mít alespoň 8 znaků."
                                            },
                                        })}
                                    />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        >
                                            {showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.password && 'Heslo musí mít alespoň 8 znaků.'}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl id="confirmPassword" isInvalid={errors.confirmPassword}>
                                <InputGroup>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="potvrďte heslo"
                                        {...register('confirmPassword', {
                                            validate: value =>
                                                value === watch("password", "") || "Hesla se neshodují"
                                        })}

                                    />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        >
                                            {showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.confirmPassword && 'Hesla se neshodují.'}
                                </FormErrorMessage>
                            </FormControl>
                            <Stack spacing={4}>
                                <HStack>
                                    <Box>
                                        <FormControl id="name" isRequired>
                                            <FormLabel>Jméno</FormLabel>
                                            <Input
                                                name="name"
                                                type="name"
                                                placeholder="jméno"
                                                {...register("name", {required: true})}
                                            />
                                            <FormErrorMessage>
                                                {errors.name && 'Zadejte jméno.'}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </Box>
                                    <Box>
                                        <FormControl id="surname" isRequired>
                                            <FormLabel>Příjmení</FormLabel>
                                            <Input
                                                name="surname"
                                                type="surname"
                                                placeholder="příjmení"
                                                {...register("surname", {required: true})}
                                            />
                                            <FormErrorMessage>
                                                {errors.surname && 'Zadejte příjmení.'}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </Box>
                                </HStack>


                                <Stack spacing={6}>
                                    <Stack spacing={2} pt={2}>
                                        <Button rounded={'full'}
                                                colorScheme={'orange'}
                                                bg={'orange.400'}
                                                _hover={{bg: 'orange.500'}}
                                                type="submit">
                                            Vytvořit účet
                                        </Button>
                                        {error &&
                                            <Text fontSize='xs' color='red'>
                                                Při vytváření uživatelského účtu došlo k erroru. Zkuste to prosím znovu.
                                            </Text>}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </form>

                </Box>
            </Stack>
        </Flex>
    )
}

export default RegisterUser