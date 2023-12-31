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
import {PrimaryButton, SecondaryButton} from "./styles/Buttons";

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

    const formatUser = (user) => {
        if (user == null) {
            return "Uživatel není dostupný."
        }
        return `${user.name} ${user.surname}`
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

                        <Center>
                            <Image
                                objectFit='contain'
                                boxSize='200px'
                                display='initial'
                                src={gift.imageUrl || "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-7.jpg"}
                                alt={gift.imageUrl ? gift.name : "thumbnail"}
                            />
                        </Center>

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
                                    Pro: {
                                    gift.recipient
                                        .map((recipient) => formatUser(
                                            users.find((user) => user.id === recipient)
                                        ))
                                        .join(", ")
                                }
                                </Text>
                            </Box>
                            <Box align={"right"}>
                                {gift.buyer === "" ? (
                                    <PrimaryButton
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditGift(gift.id, "Gifts", {
                                                buyer: currentUID
                                            })
                                        }}
                                    >
                                        Koupit
                                    </PrimaryButton>
                                ) : gift.buyer === currentUID ? (
                                    <SecondaryButton
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditGift(gift.id, "Gifts", {
                                                buyer: "",
                                            })
                                        }}
                                    >
                                        Vrátit koupi zpět
                                    </SecondaryButton>
                                ) : user.admin ? (
                                    <Button>
                                        Koupil {formatUser(users.find((user) => user.id === gift.buyer))}
                                    </Button>
                                ) : (
                                    <Button disabled={true}>
                                        Koupeno
                                    </Button>
                                )}
                                {giftError === gift.id &&
                                    <Text fontSize='xs' color='red'>Bohužel došlo k neočekávané chybě, zkuste to
                                        později.</Text>}
                            </Box>
                        </Box>
                        <GiftDetailModal gift={gift} btnRef={btnRef} user={user} users={users}
                                         onClose={() => setOpenedModal(null)} isOpen={openedModal === gift.id}
                                         handleEditGift={handleEditGift} currentUID={currentUID}/>
                    </>
                </Box>
            ))}
        </>
    )
}

export default GiftList