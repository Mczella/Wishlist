import {onSnapshot, collection} from "firebase/firestore"
import {useContext, useEffect, useState} from "react"
import {db} from "./firebase"
import {Ul} from "./styles/ul"
import {handleDelete, handleEdit} from "./Crud"
import {AuthorizationContext} from "./AuthorizationContext"
import RegisterUser from "./RegisterUser"
import AddNewUser from "./AddNewUser"
import {
    Box,
    Button, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay, Stack,
    useDisclosure,
    Text, SimpleGrid, Heading
} from "@chakra-ui/react";


const Users = () => {
    const [users, setUsers] = useState([])
    const [editMode, setEditMode] = useState({})
    const [values, setValues] = useState({})
    const currentUID = useContext(AuthorizationContext).currentUser.uid
    const {isOpen: isCredentialsOpen, onOpen: onCredentialsOpen, onClose: onCredentialsClose} = useDisclosure()
    const {isOpen: isSimpleOpen, onOpen: onSimpleOpen, onClose: onSimpleClose} = useDisclosure()


    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
        console.log("users", values)
    }

    useEffect(() => {
            const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
                    setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
                })
            return () => unsubscribe()
        }, [setUsers])

    const handleEditClick = (itemId) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [itemId]: !prevEditMode[itemId],
        }))
    }

    const isAdmin = () => {
        const currentUser = users.find((user) => user.id === currentUID)
        return currentUser.admin
    }


    return (
        <>
            <Button
                onClick={onCredentialsOpen}
            >
                Přidat nového uživatele s přihlašovacími údaji.
            </Button>
            <Modal isOpen={isCredentialsOpen} onClose={onCredentialsClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalCloseButton/>
                    <RegisterUser variant={"modal"} onCredentialsClose={onCredentialsClose}/>
                </ModalContent>
            </Modal>
            <Button
                onClick={onSimpleOpen}
            >
                Přidat nového neaktivního uživatele.
            </Button>
            <Modal isOpen={isSimpleOpen} onClose={onSimpleClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalCloseButton/>
                    <AddNewUser onSimpleClose={onSimpleClose}/>
                </ModalContent>
            </Modal>

            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
                {users.map((user) => (
                            isAdmin() || user.id === currentUID ? ( // presunout do useeffect
                    <Box
                        maxW='sm' borderWidth='1px'
                        rounded={'md'}
                        bg={'white'}
                        boxShadow={'lg'}
                        overflow='hidden'
                        key={user.id}>
                        <Box p='6'>
                                <>
                                    <Box mt='1' fontWeight='semibold' lineHeight='tight' height={12}
                                         noOfLines={2}>
                                        <Heading fontSize={'xl'} textAlign={'center'}>{editMode[user.id] ?
                                            <Input
                                                name="name"
                                                defaultValue={user.name}
                                                onChange={handleInputChange}
                                            /> : user.name}
                                        </Heading>
                                        <Heading fontSize={'xl'} textAlign={'center'}>{editMode[user.id] ?
                                            <Input
                                                name='surname'
                                                defaultValue={user.surname}
                                                onChange={handleInputChange}
                                            /> : user.surname}
                                        </Heading>
                                    </Box>
                                    <Stack spacing={6} direction={'row'}>
                                        {editMode[user.id] ?
                                            <Button
                                                rounded={'full'}
                                                px={6}
                                                colorScheme={'orange'}
                                                bg={'orange.400'}
                                                _hover={{bg: 'orange.500'}}
                                                onClick={() => {
                                                    handleEdit(user.id, "users", values);
                                                    handleEditClick(user.id)
                                                }}
                                            >
                                                Uložit
                                            </Button> :
                                            <Button
                                                rounded={'full'} px={6}
                                                onClick={() => handleEditClick(user.id)}
                                            >
                                                Upravit
                                            </Button>
                                        }
                                        {/*add comfirmation popup*/}
                                        <Button
                                            disabled={user.id === currentUID}
                                            onClick={() => {
                                                handleDelete(user.id, "users")
                                            }}
                                        >
                                            Smazat
                                        </Button>
                                    </Stack>
                                </>
                        </Box>
                    </Box>
                                ) : null
                ))}
            </SimpleGrid>
        </>
    )
}

export default Users