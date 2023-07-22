import React, { useContext, useState } from "react"
import "./styles/login.css"
import { signInWithEmailAndPassword} from "firebase/auth"
import { auth } from "./firebase"
import { useNavigate } from "react-router-dom"
import {AuthorizationContext} from "./AuthorizationContext"
import styled from '@emotion/styled'
import logo from './img.jpeg'
import {LoginForm} from "./styles/LoginForm"
import RegisterUser from "./RegisterUser"



const LoginStyle = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background: darkgoldenrod;
 `


const Content = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 1.4;
  background: #f1f1f1;
  padding: 0px;
  border-radius: 0.5rem;
  width: 50%;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: center;
  h1 {
    font-size: xxx-large;
    padding: 20px 20px 0px 20px;
    margin-block-end: 0;
  }
  p {
    font-size: large;
    color: #282c34;
    padding: 0px 20px 0px 20px;
  }
 `
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom-right-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
 `

const FormDiv = styled.div`
  flex: 2;
 `


const ImgDiv = styled.div`
  flex: 1;
 `


const Login = () => {
    const [error, setError] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const {dispatch} = useContext(AuthorizationContext)

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            dispatch({ type: "LOGIN", payload: user })
            navigate("/")
        } catch (error) {
            setError(true)
            console.log(error)
        }
    }

    return (
        <LoginStyle>
            <Content>
                <FormDiv>
                    <h1>Vítejte!</h1>
                    <p>Prosím přihlaste se nebo se zaregistrujte.</p>
                    <LoginForm onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="e-mail"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="heslo"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                        {error && <span>Špatný e-mail nebo heslo.</span>}
                    </LoginForm>

                    <RegisterUser/>

                </FormDiv>
                <ImgDiv>
                    <Image src={logo} alt="logo" />
                </ImgDiv>

            </Content>
        </LoginStyle>
    )
}

export default Login