import {useForm} from "react-hook-form";
import React, {useContext, useRef, useState} from "react";
import {AuthorizationContext} from "./AuthorizationContext";
import GiftList from "./GiftList";
import {
    Badge,
    Box, Button, ButtonGroup,
    Center, Checkbox, CheckboxGroup, Divider, IconButton, Image,
    Input, Link, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Stack, Text, Textarea, Code,
    FormControl,
    FormLabel, useDisclosure,
} from "@chakra-ui/react"
import {handleDelete, handleEdit} from "./Crud"
import {CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Select} from "chakra-react-select"
import AlertPopup from "./AlertPopup";

const GiftDetailModal = ({gift, btnRef, user, users, onClose, isOpen, handleEditGift}) => {
    const [editMode, setEditMode] = useState({})
    const [values, setValues] = useState({})
    const [checkedUsers, setCheckedUsers] = useState([])
    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} ${user.surname}`,
    }))
    const { isOpen: isAlertOpen, onOpen, onClose: onAlertClose } = useDisclosure()
    const cancelRef = useRef()

    const handleCheckboxChange = (e, userId) => {
        const chosenUser = users.find((user) => user.id === userId)
        const fullName = `${chosenUser.name} ${chosenUser.surname}`

        if (e.target.checked && chosenUser) {

            setCheckedUsers((prevCheckedUsers) => [...prevCheckedUsers, fullName])
        } else if (!e.target.checked && chosenUser) {
            setCheckedUsers((prevCheckedUsers) =>
                prevCheckedUsers.filter((name) => name !== fullName)
            )
        }
        setValues((prevValues) => ({
            ...prevValues,
            ["recipient"]: checkedUsers,
        }))
    }


    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleEditClick = (itemId) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [itemId]: !prevEditMode[itemId],
        }))
    }

    return (
        <>
        <Modal
            onClose={onClose}
            finalFocusRef={btnRef}
            isOpen={isOpen}
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
                                <Badge onClick={(e) => e.stopPropagation()}
                                       borderRadius='full'
                                       px='2' colorScheme='orange'>
                                    <Link href={gift.link}
                                          target="_blank">
                                        Prohlédnout v e-shopu
                                    </Link>
                                </Badge>
                            </Box>
                            <Divider/>
                            <Box>
                                <Text pb={2} fontSize={'md'} color={'gray.600'}>
                                    Pro:
                                    {editMode[gift.id] ? (

                                        <FormControl>
                                            <Select
                                                defaultValue = {gift.recipient}
                                                colorScheme="orange"
                                                focusBorderColor="orange.400"
                                                isMulti
                                                name="users"
                                                options={userOptions}
                                                placeholder="Vyberte, pro koho je dárek..."
                                                variant="outline"
                                                useBasicStyles
                                                selectedOptionStyle="check"
                                            />
                                        </FormControl>

                                    ) : (
                                        gift.recipient
                                    )}
                                </Text>
                            </Box>
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
                                                    handleEditClick(gift.id)
                                                }}
                                                icon={<CloseIcon/>}/>
                                </>
                            ) : (
                                <IconButton rounded={'full'}
                                            colorScheme={'orange'}
                                            _hover={{textColor: 'orange.500'}}
                                            onClick={() => handleEditClick(gift.id)}
                                            disabled={!((gift.creator === `${user.name} ${user.surname}`) || user.admin)}
                                            icon={<EditIcon/>}/>
                            )}
                        </ButtonGroup>
                        <IconButton rounded={'full'}
                                    variant={'ghost'}
                                    aria-label='Zrušit'
                                    colorScheme={'orange'}
                                    onClick={onOpen}
                                    icon={<DeleteIcon/>}/>

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
                        {/* {giftError === gift.id &&
                            <span>Bohužel došlo k neočekávané chybě, zkuste to později.</span>}*/}
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <AlertPopup isAlertOpen={isAlertOpen} onAlertClose={onAlertClose} cancelRef={cancelRef} onDelete={() => handleDelete(gift.id, "Gifts")}/>
            </>
    )
}
export default GiftDetailModal