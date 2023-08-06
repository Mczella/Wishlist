import { Button } from '@chakra-ui/react';

export const PrimaryButton = (props) => {
    return (
    <Button rounded={'lg'}
            colorScheme={'orange'}
            bg={'orange.400'}
            _hover={{bg: 'orange.500'}}
            {...props}
            ref={props.originalRef}
            />
        )
}

export const SecondaryButton = (props) => {
    return (
        <Button
            rounded={'lg'}
            variant={'outline'}
            colorScheme={'orange'}
            _hover={{textColor: 'orange.500'}}
            {...props}
        />
    )

}

