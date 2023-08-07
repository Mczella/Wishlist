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

const GiftDetailModal = ({gift, btnRef, user, users, onClose, isOpen, handleEditGift, currentUID}) => {
    const [editMode, setEditMode] = useState({})
    const [values, setValues] = useState({})
    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} ${user.surname}`,
    }))
    const { isOpen: isAlertOpen, onOpen, onClose: onAlertClose } = useDisclosure()
    const cancelRef = useRef()


    const handleSelectChange = (e) => {
        const recipients = e.map(item => ({
            recipient: item,
            label: item.label,
            value: item.value
        }));
        setValues((prevValues) => ({
            ...prevValues,
            recipient: recipients.map(item => item.value)
        }));

    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const formatUser = (user) => {
        if (user == null) {
            return "Uživatel není dostupný."
        }
        return `${user.name} ${user.surname}`
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
                                <Text align={"justify"} fontWeight={'normal'} fontSize={'md'} color={'gray.600'}>
                                    Obrázek:
                                </Text>
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
                                    src={gift.imageUrl || "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-7.jpg"}
                                    alt={gift.imageUrl ? gift.name : "thumbnail"}
                                />
                            </Center>
                        )}
                        <Box p='6'>
                            <Box mt='1' fontWeight='semibold' lineHeight='tight'>
                                {editMode[gift.id] ? (
                                    <>
                                    <Text align={"justify"} fontWeight={'normal'} fontSize={'md'} color={'gray.600'}>
                                        Název
                                        </Text>
                                    <Input
                                        name="name"
                                        defaultValue={gift.name}
                                        onChange={handleInputChange}
                                    />
                                    </>
                                ) : (
                                    gift.name
                                )}
                            </Box>
                            <Box mt='1'>
                                <Text align={"justify"} fontSize={'md'} color={'gray.600'}>
                                    {editMode[gift.id] ? (
                                        <>
                                            <Text>Popis:</Text>
                                        <Textarea
                                            name="description"
                                            defaultValue={gift.description}
                                            onChange={handleInputChange}
                                        />
                                            </>
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
                                    Pro:{" "}
                                    {editMode[gift.id] ? (

                                        <FormControl>
                                            <Select
                                                defaultValue = {
                                                    gift.recipient
                                                        .map((recipient) => users.find((user) => user.id === recipient))
                                                        .map((user)=> ({
                                                            value: user.id,
                                                            label:formatUser(user)
                                                        }))
                                                }
                                                colorScheme="orange"
                                                focusBorderColor="orange.400"
                                                isMulti
                                                name="users"
                                                options={userOptions}
                                                placeholder="Vyberte, pro koho je dárek..."
                                                variant="outline"
                                                useBasicStyles
                                                selectedOptionStyle="check"
                                                onChange={handleSelectChange}
                                            />
                                        </FormControl>

                                    ) : (
                                        gift.recipient
                                            .map((recipient) => formatUser(
                                                users.find((user) => user.id === recipient)
                                            ))
                                            .join(", ")
                                    )
                                    }
                                </Text>
                            </Box>
                            <Text py={2} fontSize={'md'} color={'gray.600'}>
                                Kdo vytvořil: {formatUser(users.find(user => user.id === gift.creator))}
                            </Text>
                        </Box>
                    </>
                </ModalBody>
                <ModalFooter>
                        <IconButton rounded={'lg'}
                                    variant={'ghost'}
                                    aria-label='Zrušit'
                                    colorScheme={'orange'}
                                    onClick={onOpen}
                                    icon={<DeleteIcon/>}/>
                    <ButtonGroup spacing='2'>
                        <ButtonGroup
                            isAttached variant='outline'
                        >
                            {editMode[gift.id] ? (
                                <>
                                    <Button rounded={'lg'}
                                            colorScheme={'orange'}
                                            onClick={() => {
                                                handleEdit(gift.id, "Gifts", values)
                                                handleEditClick(gift.id)
                                            }}>Uložit
                                    </Button>
                                    <IconButton rounded={'lg'}
                                                aria-label='Zrušit'
                                                colorScheme={'orange'}
                                                _hover={{textColor: 'orange.500'}}
                                                onClick={() => {
                                                    handleEditClick(gift.id)
                                                }}
                                                icon={<CloseIcon/>}/>
                                </>
                            ) : (
                                <Button rounded={'lg'}
                                            colorScheme={'orange'}
                                            _hover={{textColor: 'orange.500'}}
                                            onClick={() => handleEditClick(gift.id)}
                                            disabled={!((gift.creator === currentUID) || user.admin)}
                                            >
                                    Upravit
                                </Button>
                            )}
                        </ButtonGroup>

                        {gift.buyer === "" ? (
                            <Button
                                onClick={() => handleEditGift(gift.id, "Gifts", {
                                    buyer: currentUID
                                })}
                                rounded={'lg'}
                                colorScheme={'orange'}
                                bg={'orange.400'}
                                _hover={{bg: 'orange.500'}}
                            >
                                Koupit
                            </Button>
                        ) : gift.buyer === currentUID ? (
                            <Button
                                onClick={() =>
                                    handleEdit(gift.id, "Gifts", {
                                        buyer: "",
                                    })
                                }
                                rounded={'lg'}
                                variant={'outline'}
                                colorScheme={'orange'}
                                _hover={{textColor: 'orange.500'}}
                            >
                                Vrátit koupi zpět
                            </Button>
                        ) : user.admin ? (
                            <Button>
                                Koupil {formatUser(users.find((user) => user.id === gift.buyer))}
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