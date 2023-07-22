import { createContext, useEffect, useReducer } from "react"
import AuthorizationReducer from "./AuthorizationReducer"

const userFromLocalStorage = localStorage.getItem("user")
let parsedUser = null;

try {
    parsedUser = JSON.parse(userFromLocalStorage)
} catch (error) {
    console.error('Error parsing user data from localStorage:', error)
}
const INITIAL_STATE = {
    currentUser: parsedUser,
}

export const AuthorizationContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthorizationReducer, INITIAL_STATE)

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.currentUser))
    }, [state.currentUser])

    return (
        <AuthorizationContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthorizationContext.Provider>
    )
}

