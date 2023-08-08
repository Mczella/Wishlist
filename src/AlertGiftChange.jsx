import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter
} from "@chakra-ui/react"


const AlertGiftChange = ({isOpen, onClose, cancelRef, onDelete, changedGifts, deletedGifts}) => {
    return (

        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay/>

            <AlertDialogContent>
                <AlertDialogHeader>Chcete uživatele opravdu smazat?</AlertDialogHeader>
                <AlertDialogCloseButton/>
                <AlertDialogBody>
                    Smazáním uživatele smažete {deletedGifts} dárků a uživatele smažete z {changedGifts} dárků.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button rounded={'lg'}
                            colorScheme={'orange'}
                            bg={'orange.400'}
                            _hover={{bg: 'orange.500'}}
                            onClick={onDelete}>
                        Ano
                    </Button>
                    <Button variant='outline' colorScheme='red' ml={3} ref={cancelRef} onClick={onClose}>
                        Ne
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AlertGiftChange