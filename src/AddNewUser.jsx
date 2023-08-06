import {useForm} from "react-hook-form"
import {handleAdd} from "./Crud"
import React, {useState} from "react"
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text
} from "@chakra-ui/react";
import {PrimaryButton} from "./styles/Buttons";


const AddNewUser = ({onSimpleClose}) => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({mode: "onBlur"})
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        setIsLoading(true)
        //if user does not exist already
        try {
            const updatedData = {...data, admin: false}
            handleAdd(updatedData, "users")
        } catch (error) {
            setError(true)
            console.log(error)
        } finally {
            setIsLoading(false)
            if (!error) {
                onSimpleClose()
            }
        }
    }


    return (
        <Flex
            minH={0}
            align={'baseline'}
            justify={'center'}
            bg={'gray.200'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={2} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Vytvořte uživatele
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        bez přihlašovacích údajů
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'white'}
                    boxShadow={'lg'}
                    p={8}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>

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
                            <Stack spacing={6}>
                                <Stack spacing={2} pt={2}>
                                    <PrimaryButton isLoading={isLoading}
                                        type="submit">
                                        Vytvořit uživatele
                                    </PrimaryButton>
                                    {error &&
                                        <Text fontSize='xs' color='red'>
                                            Při vytváření uživatelského účtu došlo k chybě. Zkuste to prosím znovu.
                                        </Text>}

                                </Stack>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    )
}

export default AddNewUser