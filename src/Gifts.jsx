import {onSnapshot, collection, query, orderBy, where} from "firebase/firestore"
import React, {useEffect, useState} from "react"
import {db} from "./firebase"
import {
    SimpleGrid,
    MenuItemOption,
    MenuOptionGroup,
    MenuList,
    MenuButton,
    Menu,
    HStack,
    MenuDivider, Text, Center
} from "@chakra-ui/react";
import GiftList from "./GiftList";


const Gifts = () => {
    const [gifts, setGifts] = useState([])
    const [users, setUsers] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [order, setOrder] = useState(null)
    const [filter, setFilter] = useState(null)
    const [chooseUser, setChooseUser] = useState(null)


    useEffect(() => {
        const constraints = []

        if (order && order === "asc") {
            constraints.push(orderBy("name"))
        } else if (order && order === "desc") {
            constraints.push(orderBy("name", "desc"))
        }

        if (filter && chooseUser) {
            if (filter === "buyer") {
                constraints.push(where("buyer", "in", chooseUser))
            }
            if (filter === "recipient") {
                constraints.push(where("recipient", "array-contains-any", chooseUser))
            }
            if (filter === "creator") {
                constraints.push(where("creator", "in", chooseUser))
            }
        }

        const q = query(collection(db, "Gifts"), orderBy("buyer"), ...constraints)

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setGifts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setIsLoaded(true)
        })
        return () => unsubscribe()
    }, [chooseUser, filter, order, setGifts])


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })

        return () => unsubscribe()
    }, [setUsers])


    return (
        <>
            <HStack justifyContent={'flex-end'}>
                <Menu closeOnSelect={false}>
                    <MenuButton
                        px={4}
                        py={2}
                        transition='all 0.2s'
                        borderRadius='md'
                        borderWidth='1px'
                        _hover={{bg: 'gray.200'}}
                        _expanded={{bg: 'gray.200'}}
                        _focus={{boxShadow: 'outline'}}
                    >
                        Filtrovat
                    </MenuButton>
                    <MenuList minWidth='240px'>
                        <MenuOptionGroup onChange={(e) => setFilter(e)} title='Filtrovat' type='radio'>
                            <MenuItemOption value='buyer'>Dle kupce</MenuItemOption>
                            <MenuItemOption value='creator'>Dle zadavatele</MenuItemOption>
                            <MenuItemOption value='recipient'>Dle obdarovávaného</MenuItemOption>
                        </MenuOptionGroup>
                        <MenuDivider/>
                        <MenuOptionGroup onChange={(e) => setChooseUser(e)} title='Uživatel' type='checkbox'>
                            {users.map((user) => (
                                <MenuItemOption key={user.id} value={user.id}>
                                    {user.name} {user.surname}
                                </MenuItemOption>))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton
                        px={4}
                        py={2}
                        transition='all 0.2s'
                        borderRadius='md'
                        borderWidth='1px'
                        _hover={{bg: 'gray.200'}}
                        _expanded={{bg: 'grey.200'}}
                        _focus={{boxShadow: 'outline'}}
                    >
                        Seřadit
                    </MenuButton>
                    <MenuList minWidth='240px'>
                        <MenuOptionGroup onChange={(e) => setOrder(e)} title='Seřadit' type='radio'>
                            <MenuItemOption value='asc'>Dle názvu vzestupně</MenuItemOption>
                            <MenuItemOption value='desc'>Dle názvu sestupně</MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            </HStack>
            {gifts.length === 0 ?
                <Center><Text>Pro váš výběr nebyly nalezeny žádné výsledky.</Text></Center> : null
            }
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
                <GiftList gifts={gifts} users={users} isLoaded={isLoaded}/>
            </SimpleGrid>
        </>
    )
}

export default Gifts