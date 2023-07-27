import {onSnapshot, collection} from "firebase/firestore"
import React, {useContext, useEffect, useRef, useState} from "react"
import {db} from "./firebase"
import {doc} from "firebase/firestore"
import {handleDelete, handleEdit} from "./Crud"
import {AuthorizationContext} from "./AuthorizationContext"
import {
    Box,
    Button,
    Input,
    SimpleGrid,
    Text,
    Stack,
    Image,
    Link,
    Divider,
    Badge,
    ButtonGroup,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Modal,
    ModalHeader,
    ModalBody, ModalFooter, Checkbox, CheckboxGroup, Textarea, Center, IconButton, useDisclosure
} from "@chakra-ui/react";
import {CloseIcon, DeleteIcon} from "@chakra-ui/icons";


const Gifts = () => {
    const [user, setUser] = useState(null)
    const [gifts, setGifts] = useState([])
    const [editMode, setEditMode] = useState({})
    const [values, setValues] = useState({})
    const currentUID = useContext(AuthorizationContext).currentUser.uid
    const [giftError, setGiftError] = useState(null)
    const [openedModal, setOpenedModal] = useState(null)
    const btnRef = useRef(null)
    const [users, setUsers] = useState([])
    const [checkedUsers, setCheckedUsers] = useState([])


    const handleCheckboxChange = (e, userId) => {
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
    }

    console.log(checkedUsers)
    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleEditGift = async (id, collection) => {
        try {
            await handleEdit(id, collection, {
                buyer: `${user.name} ${user.surname}`,
            })
        } catch (error) {
            setGiftError(id)
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Gifts"), (snapshot) => {
            setGifts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
        return () => unsubscribe()
    }, [setGifts])

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "users", currentUID), (querySnapshot) => {
            setUser({
                name: querySnapshot.get("name"),
                surname: querySnapshot.get("surname"),
                admin: querySnapshot.get("admin"),
            })
        })

        return () => unsubscribe()
    }, [currentUID, setUser])

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
    console.log(users)

    return (
        <div>
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
                {gifts.map((gift) => (
                    <Box
                        maxW='sm' borderWidth='1px'
                        rounded={'md'}
                        bg={'white'}
                        boxShadow={'lg'}
                        overflow='hidden'
                        key={gift.id}
                        pt={6}
                        _hover={{boxShadow: 'inner'}}
                        onClick={() => setOpenedModal(gift.id)}
                        ref={btnRef}

                    >
                        <>
                                <Image
                                    objectFit='contain'
                                    boxSize='200px'
                                    display='initial'
                                    src={gift.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                    alt={gift.imageUrl ? gift.name : "thumbnail"}
                                />

                            <Box p='6'>
                                <Box mt='1' fontWeight='semibold' lineHeight='tight' height={12} noOfLines={2}>
                                    {gift.name}
                                </Box>
                                <Box mt='1' align={"justify"} height={16} noOfLines={3}>
                                    <Text fontSize={'sm'} color={'gray.600'}>
                                        {gift.description}
                                    </Text>
                                </Box>
                                <Box display='flex' py={2} alignItems='baseline'>
                                    <Badge onClick={(e) => e.stopPropagation()} borderRadius='full' px='2'
                                           colorScheme='orange'>
                                        <Link href={gift.link}
                                              target="_blank">
                                            Prohlédnout v e-shopu
                                        </Link>
                                    </Badge>
                                </Box>
                                <Divider/>
                                <Box>
                                    <Text align={"left"} fontSize={'sm'} color={'gray.600'}>
                                        Pro: {gift.recipient}
                                    </Text>
                                </Box>
                                <Box align={"right"}>
                                    {gift.buyer === "" ? (
                                        <Button
                                            rounded={'full'}
                                            colorScheme={'orange'}
                                            bg={'orange.400'}
                                            _hover={{bg: 'orange.500'}}
                                            onClick={() => handleEditGift(gift.id, "Gifts")}
                                        >
                                            Koupit
                                        </Button>
                                    ) : gift.buyer === `${user.name} ${user.surname}` ? (
                                        <Button
                                            rounded={'full'}
                                            variant={'outline'}
                                            colorScheme={'orange'}
                                            _hover={{textColor: 'orange.500'}}
                                            onClick={() =>
                                                handleEdit(gift.id, "Gifts", {
                                                    buyer: "",
                                                })
                                            }
                                        >
                                            Vrátit koupi zpět
                                        </Button>
                                    ) : user.admin ? (
                                        <Button>
                                            Koupil {gift.buyer}
                                        </Button>
                                    ) : (
                                        <Button disabled={true}>
                                            Koupeno
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                            <Modal
                                onClose={() => setOpenedModal(null)}
                                finalFocusRef={btnRef}
                                isOpen={openedModal === gift.id}
                                scrollBehavior="inside"

                            >
                                <ModalOverlay/>
                                <ModalContent>
                                    <ModalHeader>{gift.name}</ModalHeader>
                                    <ModalCloseButton/>
                                    <ModalBody>

                                        <>
                                            {editMode[gift.id] ? (
                                                <Box p='6'>
                                                <Input
                                                    name="imageUrl"
                                                    defaultValue={gift.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                                    onChange={handleInputChange}
                                                />
                                                </Box>
                                            ) : (
                                                <Center>
                                                <Image
                                                    objectFit='contain'
                                                    boxSize='200px'
                                                    display='initial'
                                                    src={gift.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                                    alt={gift.imageUrl ? gift.name : "thumbnail"}
                                                />
                                                </Center>
                                            )}
                                            <Box p='6'>
                                                <Box mt='1' fontWeight='semibold' lineHeight='tight'>
                                                    {editMode[gift.id] ? (
                                                        <Input
                                                            name="name"
                                                            defaultValue={gift.name}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        gift.name
                                                    )}
                                                </Box>
                                                <Box mt='1'>
                                                    <Text align={"justify"} fontSize={'md'} color={'gray.600'}>
                                                        {editMode[gift.id] ? (
                                                            <Textarea
                                                                name="description"
                                                                defaultValue={gift.description}
                                                                onChange={handleInputChange}
                                                            />
                                                        ) : (
                                                            gift.description
                                                        )}
                                                    </Text>
                                                </Box>
                                                <Box display='flex' py={2} alignItems='baseline'>
                                                    <Badge onClick={(e) => e.stopPropagation()} borderRadius='full'
                                                           px='2' colorScheme='orange'>
                                                        <Link href={gift.link}
                                                              target="_blank">
                                                            Prohlédnout v e-shopu
                                                        </Link>
                                                    </Badge>
                                                </Box>
                                                <Divider/>
                                                <Box>
                                                    <Text  pb={2} fontSize={'md'} color={'gray.600'}>
                                                        Pro:


                                                    {editMode[gift.id] ? (
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
                                                    ) : (

                                                            gift.recipient
                                                    )}

                                                    </Text>
                                                </Box>
                                                {/*koupí a vytvořil má vidět pouze owner*/}
                                                <Text py={2} fontSize={'md'} color={'gray.600'}>
                                                    Kdo vytvořil: {gift.creator}
                                                </Text>
                                            </Box>
                                        </>
                                    </ModalBody>
                                    <ModalFooter>
                                        <ButtonGroup onClick={(e) => e.stopPropagation()} spacing='2'>
                                        <ButtonGroup
                                            onClick={(e) => e.stopPropagation()}
                                            isAttached variant='outline'
                                            >
                                            {editMode[gift.id] ? (
                                                <>
                                                    <Button rounded={'full'}
                                                            colorScheme={'orange'}
                                                            disabled={true}
                                                            onClick={() => {
                                                                handleEdit(gift.id, "Gifts", values)
                                                                handleEditClick(gift.id)
                                                            }}>Uložit
                                                    </Button>
                                                    <IconButton rounded={'full'}
                                                                aria-label='Zrušit'
                                                                colorScheme={'orange'}
                                                                _hover={{textColor: 'orange.500'}}
                                                                onClick={() => {
                                                                handleEditClick(gift.id)}}
                                                                icon={<CloseIcon />} />
                                                </>
                                            ) : (
                                                <Button rounded={'full'}
                                                        colorScheme={'orange'}
                                                        _hover={{textColor: 'orange.500'}}
                                                        onClick={() => handleEditClick(gift.id)}
                                                        disabled={!((gift.creator === `${user.name} ${user.surname}`) || user.admin)}
                                                >
                                                    Upravit
                                                </Button>
                                            )}
                                        </ButtonGroup>
                                            <IconButton rounded={'full'}
                                                        variant={'ghost'}
                                                        aria-label='Zrušit'
                                                        colorScheme={'orange'}
                                                        onClick={() => {
                                                            handleDelete(gift.id, "Gifts")}}
                                                        icon={<DeleteIcon />} />

                                            {gift.buyer === "" ? (
                                                <Button
                                                    onClick={() => handleEditGift(gift.id, "Gifts")}
                                                    rounded={'full'}
                                                    colorScheme={'orange'}
                                                    bg={'orange.400'}
                                                    _hover={{bg: 'orange.500'}}
                                                >
                                                    Koupit
                                                </Button>
                                            ) : gift.buyer === `${user.name} ${user.surname}` ? (
                                                <Button
                                                    onClick={() =>
                                                        handleEdit(gift.id, "Gifts", {
                                                            buyer: "",
                                                        })
                                                    }
                                                    rounded={'full'}
                                                    variant={'outline'}
                                                    colorScheme={'orange'}
                                                    _hover={{textColor: 'orange.500'}}
                                                >
                                                    Vrátit koupi zpět
                                                </Button>
                                            ) : user.admin ? (
                                                <Button>
                                                    Koupil {gift.buyer}
                                                </Button>
                                            ) : (
                                                <Button disabled={true}>
                                                    Koupeno
                                                </Button>
                                            )}
                                            {giftError === gift.id &&
                                                <span>Bohužel došlo k neočekávané chybě, zkuste to později.</span>}
                                            {/*Add delete gift*/}
                                        </ButtonGroup>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </>
                    </Box>
                ))}
            </SimpleGrid>
        </div>
    )
}

export default Gifts