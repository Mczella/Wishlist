import { signOut } from "firebase/auth"
import {useNavigate} from "react-router-dom"
import {AuthorizationContext} from "./AuthorizationContext"
import {useContext, useState} from "react"
import { auth } from "./firebase"

const SignOut = () => {

    const navigate = useNavigate()
    const {dispatch} = useContext(AuthorizationContext)
    const [error, setError] = useState("")


    const handleSignOut = async () => {
        try {
            await signOut(auth)
            dispatch({ type: "LOGOUT" })
            navigate("/")
        } catch (error) {
            setError(true)
            console.log(error)
        }
    };

    return (
        // add popup with error
        <a href="#" onClick={handleSignOut}>Odhlásit</a>
    )
}

export default SignOut