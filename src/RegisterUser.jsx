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
import {PrimaryButton} from "./styles/Buttons";


const RegisterUser = ({variant, onCredentialsClose}) => {
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
    const [isLoading, setIsLoading] = useState(false)


    const createUser = async (data) => {
        setIsLoading(true)
        try {
            const newUser = await createUserWithEmailAndPassword(auth, data.email, data.password, data.name)
            const user = newUser.user
            if (location.pathname === "/signup") {
                sessionStorage.setItem("user", JSON.stringify(user))
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
        } finally {
            setIsLoading(false)
            if (variant === "modal" && !error) {
                onCredentialsClose()
            }
        }
    }


    return (
        <Flex
            minH={variant === "modal" ? "0" : '100vh'}
            align={variant === "modal" ? 'baseline' : 'center'}
            justify={'center'}
            bg={'gray.200'}>
            <Stack spacing={8}
                   mx={'auto'}
                   maxW={'lg'}
                   py={variant === 'modal' ? '2' : '12'}
                   px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        {variant === "modal" ? 'Přidejte nového uživatele' : 'Vytvořte si účet'}
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        {variant === "modal" ? 'a vytvořte mu přistupové údaje' : 'a ušetřete čas i nervy.'}
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
                                        <FormControl id="name" isInvalid={errors.name}>
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
                                        <FormControl id="surname" isInvalid={errors.surname}>
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
                                        <PrimaryButton isLoading={isLoading}
                                                type="submit">
                                            Vytvořit účet
                                        </PrimaryButton>
                                        {error &&
                                            <Text fontSize='xs' color='red'>
                                                Při vytváření uživatelského účtu došlo k chybě. Zkuste to prosím znovu.
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