import React, {useEffect, useRef, useState} from 'react'
import {getFunctions, httpsCallable} from "firebase/functions"
import AddNewGift from "./AddNewGift"
import {
    Box,
    Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon, EmailIcon} from "@chakra-ui/icons";
import {useInView} from 'react-intersection-observer'
import {createPortal} from "react-dom";
import {PrimaryButton} from "./styles/Buttons";

const FetchData = () => {
    const [defaultValues, setDefaultValues] = useState({})
    const [link, setLink] = useState("")
    const linkRef = useRef()
    const [error, setError] = useState("")
    const {isOpen, onOpen, onClose} = useDisclosure()
    const btnRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const {ref, inView} = useInView({
        initialInView: true
    })

    const clearForm = {
            name: "",
            link: "",
            recipient: "",
            description: "",
            imageUrl: ""
        }

    const handleClose = () => {
        setDefaultValues(clearForm)
        setLink("")
        onClose()
    }


    const fetchMetaData = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            const functions = getFunctions()
            const getMetaData = httpsCallable(functions, 'getMetaData')
            const result = await getMetaData({link: linkRef.current.value})
            const metadata = JSON.parse(result.data.output)
            const ogImage = metadata["twitter:image"] || metadata["og:image"]
            setDefaultValues(
                {
                    name: metadata["og:title"],
                    link: metadata["og:url"],
                    recipient: "Choose recipient",
                    description: metadata["og:description"],
                    price: 0,
                    imageUrl: ogImage

                }
            )
            console.log(defaultValues)
            console.log("url:", metadata["og:url"], "title:", metadata["og:title"], "description:", metadata["og:description"], "image:", metadata[ogImage])
        } catch (error) {
            console.error('Error fetching metadata:', error)
            setError(error)
        }
        setIsLoading(false)
    }


    return (
        <div>
            <PrimaryButton
                width={'100%'}
                originalRef={ref}
                Button leftIcon={<AddIcon/>}
                variant='solid'
                onClick={onOpen}>
                Přidat dárek
            </PrimaryButton>

            {createPortal(
                <IconButton
                    display={!inView ? 'inherit' : 'none'}
                    position={'fixed'}
                    bottom={'5%'}
                    right={'5%'}
                    isRound={true}
                    variant='solid'
                    colorScheme='orange'
                    aria-label='Add'
                    size={'lg'}
                    fontSize='20px'
                    boxShadow={'lg'}
                    _hover={{bg: 'orange.400'}}
                    onClick={onOpen}
                    icon={<Center><AddIcon/></Center>}
                />,
                document.body
            )}


            <Modal
                onClose={handleClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior="inside"
            >
                <ModalOverlay/>
                <ModalContent bg={'gray.200'}>
                    <ModalHeader>
                        <Heading fontSize={'4xl'} textAlign={'center'} mt={8} mb={4}>
                            Přidejte nový dárek
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Box
                            align={'baseline'}
                            justify={'center'}
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            p={8}>
                            <form onSubmit={fetchMetaData}>
                                <FormControl id="link">
                                    <FormLabel htmlFor="metadataLink">Pro rychlejší vyplnění formuláře vložte odkaz na
                                        dárek.</FormLabel>
                                    <Input
                                        name="metadataLink"
                                        ref={linkRef}
                                        type="text"
                                        required
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                    />

                                    <Stack spacing={6}>
                                        <Stack spacing={2} pt={2}>
                                            <PrimaryButton isLoading={isLoading}
                                                    mb={4}
                                                    type="submit">
                                                Vložit
                                            </PrimaryButton>
                                            {error &&
                                                <Text fontSize='xs' color='red'>Bohužel se nepodařilo načíst data,
                                                    zkuste to později nebo je zadejte ručně.</Text>}
                                        </Stack>
                                    </Stack>
                                </FormControl>
                            </form>
                            <AddNewGift defaultValues={defaultValues} onClose={handleClose}/>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default FetchData