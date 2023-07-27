import React, {useEffect, useState} from 'react'
import {useForm} from "react-hook-form"
import {handleAdd} from "./crud"
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Textarea,
    Image,
    Stack, Checkbox, CheckboxGroup
} from "@chakra-ui/react";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "./firebase";


const AddNewGift = ({defaultValues}) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {errors}
    } = useForm()
    const recipients = [{name: "xxx"}, {name: "yyy"}]
    const imageUrl = watch('imageUrl')
    const [isLoading, setIsLoading] = useState(false)
    const [addGiftError, setAddGiftError] = useState(false)
    const [users, setUsers] = useState([])
    const [checkedUsers, setCheckedUsers] = useState([])


/*    const handleCheckboxChange = (e, userId) => {
        const user = users.find((user) => user.id === userId)
        const fullName = `${user.name} ${user.surname}`

        if (e.target.checked && user) {

            setCheckedUsers((prevCheckedUsers) => [...prevCheckedUsers, fullName])
        } else if (!e.target.checked && user) {
            const fullName = `${user.name} ${user.surname}`
            setCheckedUsers((prevCheckedUsers) =>
                prevCheckedUsers.filter((name) => name !== fullName)
            )
        }
        setValues((prevValues) => ({
            ...prevValues,
            ["recipient"]: checkedUsers,
        }))
    }*/

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })

        return () => unsubscribe()
    }, [setUsers])


    const onSubmit = (data) => {
        setIsLoading(true)
        console.log(data)
        const updatedData = {...data, buyer: "", creator: ""}
        console.log(updatedData)
        try {
        handleAdd(updatedData, "Gifts")
        } catch (error) {
            setAddGiftError(true)
            console.log(error)
        } finally {
            setIsLoading(false)
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
    }, [defaultValues])

    return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="name" isInvalid={errors.name}>
                    <FormLabel>Název:</FormLabel>
                    <Input {...register('name', {required: true})} />
                    <FormErrorMessage>
                        {errors.name && <span>This field is required</span>}
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
                        <CheckboxGroup py={2} colorScheme='orange' name="recipient" defaultValue={gift.recipient}>
                            <Stack spacing={[1]} direction={'column'}>
                                {users.map((user) => (
                                    <Checkbox fontSize="xs"
                                              lineHeight="1"
                                              color={'gray.600'}
                                              key={user.id}
                                              value={user.id}
                                              checked={checkedUsers.includes(user.id)}
                                              onChange={(e) => handleCheckboxChange(e, user.id)}>
                                        {user.name} {user.surname}
                                    </Checkbox>
                                ))}
                            </Stack>
                            {/* onChange={handleInputChange} */}
                        </CheckboxGroup>
                        <FormErrorMessage>
                            {errors.recipient && <span>This field is required</span>}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl id="description" isInvalid={errors.description}>
                        <FormLabel>Více informací:</FormLabel>
                        <Textarea {...register('description')} />
                    </FormControl>
                    <Button isLoading={isLoading} type="submit">Submit</Button>
            </form>
)
}

export default AddNewGift
