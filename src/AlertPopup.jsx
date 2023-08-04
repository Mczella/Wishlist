import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter
} from "@chakra-ui/react";
import {handleDelete} from "./Crud";


const AlertPopup = ({isAlertOpen, onAlertClose, cancelRef, onDelete}) => {
    return (

        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onAlertClose}
            isOpen={isAlertOpen}
            isCentered
        >
            <AlertDialogOverlay/>

            <AlertDialogContent>
                <AlertDialogHeader>Chcete to opravdu smazat?</AlertDialogHeader>
                <AlertDialogCloseButton/>
                <AlertDialogBody>
                    Smazání je nevratné.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button rounded={'lg'}
                            colorScheme={'orange'}
                            bg={'orange.400'}
                            _hover={{bg: 'orange.500'}}
                            onClick={onDelete}>
                        Ano
                    </Button>
                    <Button variant='outline' colorScheme='red' ml={3} ref={cancelRef} onClick={onAlertClose}>
                        Ne
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AlertPopup