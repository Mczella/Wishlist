import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Center,
    Checkbox,
    CheckboxGroup,
    Divider,
    IconButton,
    Image,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Stack,
    Text,
    Textarea
} from "@chakra-ui/react";
import {handleDelete, handleEdit} from "./Crud";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AuthorizationContext} from "./AuthorizationContext";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "./firebase";
import GiftDetailModal from "./GiftDetailModal";

const GiftList = ({gifts, users, isLoaded}) => {

    const [giftError, setGiftError] = useState(null)
    const [openedModal, setOpenedModal] = useState(null)
    const btnRef = useRef(null)
    const [user, setUser] = useState(null)
    const currentUID = useContext(AuthorizationContext).currentUser.uid

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


    const handleEditGift = async (id, collection, values) => {
        try {
            await handleEdit(id, collection, values)
        } catch (error) {
            setGiftError(id)
        }
    }

    return (
        <>
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
                            <Skeleton isLoaded={isLoaded}>
                            <Image
                                objectFit='contain'
                                boxSize='200px'
                                display='initial'
                                src={gift.imageUrl || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                alt={gift.imageUrl ? gift.name : "thumbnail"}
                            />
                </Skeleton>

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
                                            rounded={'lg'}
                                            colorScheme={'orange'}
                                            bg={'orange.400'}
                                            _hover={{bg: 'orange.500'}}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditGift(gift.id, "Gifts", {
                                                    buyer: `${user.name} ${user.surname}`
                                                })
                                            }}
                                        >
                                            Koupit
                                        </Button>
                                    ) : gift.buyer === `${user.name} ${user.surname}` ? (
                                        <Button
                                            rounded={'lg'}
                                            variant={'outline'}
                                            colorScheme={'orange'}
                                            _hover={{textColor: 'orange.500'}}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditGift(gift.id, "Gifts", {
                                                    buyer: "",
                                                })
                                            }}
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
                                         <Text fontSize='xs' color='red'>Bohužel došlo k neočekávané chybě, zkuste to později.</Text>}
                                </Box>
                            </Box>
                            <GiftDetailModal gift={gift} btnRef={btnRef} user={user} users={users} onClose={() => setOpenedModal(null)} isOpen={openedModal === gift.id} handleEditGift={handleEditGift}/>
                        </>
                    </Box>
            ))}
        </>
    )
}

export default GiftList