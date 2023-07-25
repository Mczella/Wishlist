import React, {useRef, useState} from 'react'
import {getFunctions, httpsCallable} from "firebase/functions"
import AddNewGift from "./AddNewGift"
import {
    Button, FormControl, FormErrorMessage, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";

const FetchData = () => {
    const [defaultValues, setDefaultValues] = useState({})
    const [link, setLink] = useState("")
    const linkRef = useRef()
    const [error, setError] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchMetaData = async (e) => {
        e.preventDefault()
        setIsLoading(true)
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
    };

    return (
        <div>
            <Button mt={3} ref={btnRef} onClick={onOpen}>
                Přidat dárek
            </Button>
            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><h2>Přidejte nový dárek</h2></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={fetchMetaData}>
                            <FormControl id="link" >
                            <FormLabel htmlFor="metadataLink">Pro rychlejší vyplnění formuláře vložte odkaz na dárek.</FormLabel>
                            <Input
                                name="metadataLink"
                                ref={linkRef}
                                type="text"
                                required
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />

                            <Button type="submit" isLoading={isLoading}>Vložit</Button>
                                <FormErrorMessage>
                                    Bohužel se nepodařilo načíst data, zkuste to později nebo je zadejte ručně.
                                </FormErrorMessage>
                            </FormControl>
                        </form>
                        <AddNewGift defaultValues={defaultValues}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default FetchData