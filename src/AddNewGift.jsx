import React, {useContext, useEffect, useState} from 'react'
import {Controller, useForm} from "react-hook-form"
import {handleAdd} from "./Crud"
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Textarea,
    Image,
    Stack
} from "@chakra-ui/react";
import {collection, onSnapshot} from "firebase/firestore"
import {db} from "./firebase";
import {AuthorizationContext} from "./AuthorizationContext"
import {Select} from "chakra-react-select"
import {PrimaryButton} from "./Styles/Buttons";


const AddNewGift = ({defaultValues, onClose}) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: {errors}
    } = useForm()
    const imageUrl = watch('imageUrl')
    const [isLoading, setIsLoading] = useState(false)
    const [addGiftError, setAddGiftError] = useState(false)
    const [users, setUsers] = useState([])
    const currentUID = useContext(AuthorizationContext).currentUser.uid
    const [currentUser, setCurrentUser] = useState(null)
    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} ${user.surname}`,
    }))


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })

        return () => unsubscribe()
    }, [setUsers])

    useEffect(() => {
        const user = users.find((user) => user.id === currentUID)
        setCurrentUser(user)
    }, [currentUID, users])

    const onSubmit = (data) => {
        setIsLoading(true)
        console.log(data)
        const updatedData = {
            ...data,
            recipient: data.recipient.map((recipient) => recipient.value),
            buyer: "",
            creator: currentUser.id
        }
        console.log(updatedData)
        try {
            handleAdd(updatedData, "Gifts")
        } catch (error) {
            setAddGiftError(true)
            console.log(error)
        } finally {
            setIsLoading(false)
            if (!addGiftError) {
                onClose()
            }
        }
    }

    const validateLink = (value) => {
        try {
            new URL(value)
            return true
        } catch (error) {
            return false
        }
    }

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues, reset])

    return (

        // add reset after successfully submitting
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <FormControl id="name" isInvalid={errors.name}>
                    <FormLabel>Název:</FormLabel>
                    <Input {...register('name', {required: true})} />
                    <FormErrorMessage>
                        {errors.name && <span>Zadejte název.</span>}
                    </FormErrorMessage>
                </FormControl>

                <FormControl id="imageUrl">
                    <FormLabel>Obrázek:</FormLabel>
                    {imageUrl && (
                        <Image src={imageUrl} alt="Preview" style={{maxWidth: '100%', marginBottom: '1rem'}}/>
                    )}
                    <Input type="text" {...register('imageUrl')} />
                </FormControl>

                <FormControl id="link" isInvalid={errors.link}>
                    <FormLabel>Odkaz:</FormLabel>
                    <Input
                        {...register('link', {
                            validate: (value) => validateLink(value)
                        })}
                    />
                    <FormErrorMessage>
                        {errors.link?.type === 'validate' && <span>Zadejte platný odkaz.</span>}
                    </FormErrorMessage>
                </FormControl>

                <FormControl id="recipient" isInvalid={errors.recipient}>
                    <FormLabel>Pro koho:</FormLabel>
                    <Controller control={control} render={({field}) => (
                        <Select
                            {...field}
                            colorScheme="orange"
                            focusBorderColor="orange.400"
                            isMulti
                            options={userOptions}
                            placeholder="Vyberte, pro koho je dárek..."
                            variant="outline"
                            useBasicStyles
                            selectedOptionStyle="check"
                        />
                    )} name={"recipient"}
                    />
                    <FormErrorMessage>
                        {errors.recipient && <span>Vyberte pro koho je tento dárek.</span>}
                    </FormErrorMessage>
                </FormControl>

                <FormControl id="description" isInvalid={errors.description}>
                    <FormLabel>Více informací:</FormLabel>
                    <Textarea {...register('description')} />
                </FormControl>
                <Stack spacing={6}>
                    <Stack spacing={2} pt={2}>
                        <PrimaryButton isLoading={isLoading}
                                type="submit">
                            Přidat dárek
                        </PrimaryButton>
                        <FormErrorMessage>
                            {addGiftError && <span>Při vytváření dárku došlo k chybě. Zkuste to prosím znovu.</span>}
                        </FormErrorMessage>
                    </Stack>
                </Stack>

            </Stack>
        </form>

    )
}

export default AddNewGift
