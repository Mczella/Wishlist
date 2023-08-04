import {createContext, useEffect, useReducer, useState} from "react"
import AuthorizationReducer from "./AuthorizationReducer"

const userFromLocalStorage = localStorage.getItem("user")
const userFromSessionStorage = sessionStorage.getItem("user")
let parsedUser = null;

try {
    parsedUser = JSON.parse(userFromLocalStorage)
    if (parsedUser === null) {
        parsedUser = JSON.parse(userFromSessionStorage)
    }
} catch (error) {
    console.error('Error parsing user data from storage:', error)
}
const INITIAL_STATE = {
    currentUser: parsedUser,
}

export const AuthorizationContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthorizationReducer, INITIAL_STATE)
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(state.currentUser))
        } else {
            sessionStorage.setItem("user", JSON.stringify(state.currentUser))
        }
    }, [state.currentUser])

    return (
        <AuthorizationContext.Provider value={{currentUser: state.currentUser, dispatch, rememberMe, setRememberMe}}>
            {children}
        </AuthorizationContext.Provider>
    )
}

