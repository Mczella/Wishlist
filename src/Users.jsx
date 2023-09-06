import {onSnapshot, collection} from "firebase/firestore"
import React, {useContext, useEffect, useRef, useState} from "react"
import {auth, db} from "./firebase"
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
import {CloseIcon} from "@chakra-ui/icons";
import {SecondaryButton} from "./styles/Buttons";
import AlertGiftChange from "./AlertGiftChange";
import {useNavigate} from "react-router-dom";


const Users = () => {
    const [users, setUsers] = useState([])
    const [gifts, setGifts] = useState([])
    const [changedGifts, setChangedGifts] = useState(0)
    const [deletedGifts, setDeletedGifts] = useState(0)
    const [editMode, setEditMode] = useState({})
    const [values, setValues] = useState({})
    const currentUID = useContext(AuthorizationContext).currentUser.uid
    const {isOpen: isCredentialsOpen, onOpen: onCredentialsOpen, onClose: onCredentialsClose} = useDisclosure()
    const cancelRef = useRef()
    const [openedAlert, setOpenedAlert] = useState(null)
    const navigate = useNavigate()


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
        })
        return () => unsubscribe()
    }, [setUsers])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Gifts"), (snapshot) => {
            setGifts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
        return () => unsubscribe()
    }, [setGifts])

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

    const removeUser = async () => {
        try {
            const userAuth = auth.currentUser
            await deleteUser(userAuth)
        } catch (error) {
            console.log(error)
        }
    }

    const checkGiftsForUser = (user) => {
        gifts.map(async (gift) => {
                if (gift.recipient.includes(user.id)) {
                    if (gift.recipient.length === 1) {
                        setDeletedGifts((deletedGifts) => deletedGifts + 1)
                    } else {
                        setChangedGifts((changedGifts) => changedGifts + 1)
                    }
                }
            }
        )
    }

    const confirmDelete = async (user) => {
        gifts.map(async (gift) => {
                if (gift.recipient.includes(user.id)) {
                    if (gift.recipient.length === 1) {
                        await handleDelete(gift.id, "Gifts")
                        setDeletedGifts(0)
                    } else {
                        const index = gift.recipient.indexOf(user.id)
                        gift.recipient.splice(index, 1)
                        await handleEdit(gift.id, "Gifts", {
                            recipient: gift.recipient
                        })
                        setChangedGifts(0)
                    }
                }
            }
        )
        await handleDelete(user.id, "users")
        await removeUser()
        navigate("/")
    }
    const onDelete = (user) => {
        checkGiftsForUser(user)
        setOpenedAlert(user.id)
        //add reauthentication prompt if user has been signed in too long
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
                                                    isDisabled={!isAdmin()}
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
                                                        isDisabled={currentUID !== user.id}
                                                        mx={'2'}
                                                        onClick={() => onDelete(user)}>
                                                        Smazat
                                                    </SecondaryButton>
                                                </ButtonGroup>
                                                <AlertGiftChange onClose={() => {
                                                                    setOpenedAlert(null)
                                                                    setDeletedGifts(0)
                                                                    setChangedGifts(0)
                                                                 }}
                                                                 isOpen={openedAlert === user.id}
                                                                 cancelRef={cancelRef}
                                                                 onDelete={() => confirmDelete(user)}
                                                                 changedGifts={changedGifts}
                                                                 deletedGifts={deletedGifts}
                                                                 />
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