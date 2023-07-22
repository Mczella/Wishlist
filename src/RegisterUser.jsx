import React, {useContext, useState} from 'react'
import {Form} from "./styles/Form"
import {auth, db} from "./firebase"
import {createUserWithEmailAndPassword} from "firebase/auth"
import {useNavigate, useLocation} from "react-router-dom"
import {AuthorizationContext} from "./AuthorizationContext"
import {useForm} from "react-hook-form"
import {doc, setDoc} from "firebase/firestore"


const RegisterUser = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm({mode: "onBlur"})
    const navigate = useNavigate()
    const {dispatch} = useContext(AuthorizationContext)
    const [error, setError] = useState(false)
    const location = useLocation()


    const createUser = async (data) => {
            try {
                const newUser = await createUserWithEmailAndPassword(auth, data.email, data.password, data.name)
                const user = newUser.user
                if (location.pathname === "/login") {
                    dispatch({type: "LOGIN", payload: user})
                    navigate("/")
                    console.log(data)

                    await setDoc(doc(db, "users", user.uid), {
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                        admin: true
                    })
                } else {
                    await setDoc(doc(db, "users", user.uid), {
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                        admin: false
                    })
                }
            } catch (error) {
                setError(true)
                console.log(error)
            }
        }



    return (
        <Form onSubmit={handleSubmit(createUser)}>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                required={true}
                {...register("email", {
                    required: "Musíte zadat e-mail.",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Zadejte správný e-mail.",
                    }
                })}/>
            {errors.email && <span>Zadejte správný e-mail.</span>}

            <input
                name='password'
                id="password"
                type='password'
                autoComplete='off'
                placeholder="heslo"
                required={true}
                {...register("password", {
                    required: "Musíte zadat heslo.",
                    minLength: {
                        value: 8,
                        message: "Heslo musí mít alespoň 8 znaků."
                    },
                })}
            />
            {errors.password && <span>Zadejte heslo.</span>}

            <input
                id="confirmPassword"
                name="confirmPassword"
                type='password'
                placeholder="potvrďte heslo"
                {...register('confirmPassword', {
                    validate: value =>
                        value === watch("password", "") || "Hesla se neshodují"
                })}

            />
            {errors.confirmPassword && <span>Hesla se neshodují</span>}

            <input
                name="name"
                type="name"
                placeholder="jméno"
                {...register("name", {required: true})}
            />
            {errors.name && <span>Zadejte jméno.</span>}

            <input
                name="surname"
                type="surname"
                placeholder="příjmení"
                {...register("surname", {required: true})}
            />
            {errors.surname && <span>Zadejte příjmení.</span>}

            <button>Vytvořit účet</button>
            {error && (<span>Při vytváření uživatelského účtu došlo k erroru. Zkuste to prosím znovu.</span>)}

        </Form>

    )
}

export default RegisterUser