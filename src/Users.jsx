import {onSnapshot, collection} from "firebase/firestore"
import React, {useContext, useEffect, useRef, useState} from "react"
import {db} from "./firebase"
import {handleDelete, handleEdit} from "./Crud"
import {AuthorizationContext} from "./AuthorizationContext"
import RegisterUser from "./RegisterUser"
import AddNewUser from "./AddNewUser"
import {deleteUser} from "firebase/auth"
import {
    Button,
    Input,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Stack,
    useDisclosure,
    ButtonGroup,
    ModalHeader,
    Thead,
    Tr,
    Th,
    Td,
    Tfoot,
    Table,
    Tbody,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Select,
    IconButton,
    Box
} from "@chakra-ui/react";
import AlertPopup from "./AlertPopup";
import {CloseIcon} from "@chakra-ui/icons";
import {SecondaryButton} from "./styles/Buttons";


const Users = () => {
    const [users, setUsers] = useState([])
    const [editMode, setEditMode] = useState({})
    const [values, setValues] = useState({})
    const currentUID = useContext(AuthorizationContext).currentUser.uid
    const {isOpen: isCredentialsOpen, onOpen: onCredentialsOpen, onClose: onCredentialsClose} = useDisclosure()
    const {isOpen: isAlertOpen, onOpen, onClose: onAlertClose} = useDisclosure()
    const cancelRef = useRef()


    const handleChange = (e) => {
        const {name, value} = e.target
        console.log(values)
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
        console.log(values)
    }

    const handleSelect = (e) => {
        const {name, value} = e.target
        console.log(values)
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value === "true",
        }))
        console.log(values)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            console.log("hello")
        })
        return () => unsubscribe()
    }, [setUsers])

    console.log(users)

    const handleEditClick = (itemId) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [itemId]: !prevEditMode[itemId],
        }))
    }

    const isAdmin = () => {
        const currentUser = users.find((user) => user.id === currentUID)
        return currentUser?.admin ?? false
    }

    const removeUser = async (user) => {
        try {
            await deleteUser(user)
        } catch (error) {
            console.log(error)
        }
    }

    const onDelete = (user) => {
        console.log({user})
        handleDelete(user.id, "users")
        removeUser(user)
    }

    return (
        <>
            <Stack px={[4, 8, 12, 16]} py={8}>
                <Button width={'100%'}
                        colorScheme='orange'
                        bg={'orange.400'}
                        _hover={{bg: 'orange.500'}}
                        onClick={onCredentialsOpen}
                >
                    Přidat nového uživatele
                </Button>
                <Modal isOpen={isCredentialsOpen} onClose={onCredentialsClose}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader bg={'gray.200'} rounded={"lg"}>
                            <Tabs isFitted variant='enclosed' colorScheme={'orange'}>
                                <TabList>
                                    <Tab>Přidat uživatele</Tab>
                                    <Tab>Vytvořit účet</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <AddNewUser onSimpleClose={onCredentialsClose}/>
                                    </TabPanel>
                                    <TabPanel>
                                        <RegisterUser variant={"modal"} onCredentialsClose={onCredentialsClose}/>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </ModalHeader>
                        <ModalCloseButton/>
                        <ModalFooter bg={'gray.200'} rounded={'lg'}>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Box overflowX="auto">
                    <Table variant='simple' size={'lg'} colorScheme={'orange'}>
                        <Thead>
                            <Tr>
                                <Th>Jméno</Th>
                                <Th>Příjmení</Th>
                                <Th>Kontakt</Th>
                                <Th>Admin</Th>
                            </Tr>
                        </Thead>
                        <Tbody>


                            {users.map((user) => (
                                isAdmin() || user.id === currentUID ? ( // presunout do useeffect
                                        <Tr key={user.id}>
                                            <Td>
                                                {editMode[user.id] ? (
                                                    <Input
                                                        name="name"
                                                        defaultValue={user.name}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    user.name
                                                )} </Td>
                                            <Td>
                                                {editMode[user.id] ? (
                                                    <Input
                                                        name="surname"
                                                        defaultValue={user.surname}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    user.surname
                                                )} </Td>
                                            <Td>{user.email}</Td>
                                            <Td>{editMode[user.id] ? (
                                                <Select
                                                    name="admin"
                                                    defaultValue={user.admin ? "true" : "false"}
                                                    onChange={handleSelect}>
                                                    <option value="true">Ano</option>
                                                    <option value="false">Ne</option>
                                                </Select>
                                            ) : (
                                                user.admin ? "Ano" : "Ne"
                                            )}</Td>
                                            <Td textAlign={'right'}>
                                            <ButtonGroup>
                                                <ButtonGroup
                                                    isAttached variant='outline'
                                                >
                                                    {editMode[user.id] ? (
                                                        <>
                                                            <SecondaryButton onClick={() => {
                                                                        handleEdit(user.id, "users", values)
                                                                        handleEditClick(user.id)
                                                                    }}>Uložit
                                                            </SecondaryButton>
                                                            <IconButton aria-label='Zrušit'
                                                                        rounded={'lg'}
                                                                        colorScheme={'orange'}
                                                                        _hover={{textColor: 'orange.500'}}
                                                                        onClick={() => {
                                                                            handleEditClick(user.id)
                                                                        }}
                                                                        icon={<CloseIcon/>}/>
                                                        </>
                                                    ) : (
                                                        <SecondaryButton
                                                                onClick={() => handleEditClick(user.id)}
                                                        >
                                                            Upravit
                                                        </SecondaryButton>
                                                    )}
                                                </ButtonGroup>

                                                <SecondaryButton
                                                    mx={'2'}
                                                    onClick={onOpen}>
                                                    Smazat
                                                </SecondaryButton>
                                            </ButtonGroup>
                                                <AlertPopup isAlertOpen={isAlertOpen} onAlertClose={onAlertClose}
                                                            cancelRef={cancelRef} onDelete={() => onDelete(user)}/>
                                            </Td>
                                        </Tr>)
                                    : null
                            ))}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Jméno</Th>
                                <Th>Příjmení</Th>
                                <Th>Kontakt</Th>
                                <Th>Admin</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </Box>
            </Stack>
        </>
    )
}

export default Users