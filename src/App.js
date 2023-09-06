import React, {useContext} from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom"
import Login from "./Login"
import Home from "./Home"
import {AuthorizationContext} from "./AuthorizationContext"
import Navbar from "./Navbar"
import Users from "./Users"
import WelcomePage from "./WelcomePage";
import RegisterUser from "./RegisterUser";

const App = () => {

    const {currentUser} = useContext(AuthorizationContext)
    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />
    }

    return (
        <Router>
            <div className="App">

                <Routes>
                        <Route path="/" element={<WelcomePage/>} />
                        <Route path="/login" element={<Login />} />
                        {/*<Route path="/signup" element={<RegisterUser />} />*/}
                        <Route
                            path="/home"
                            element={
                                <RequireAuth>
                                    <Navbar/>
                                    <Home/>
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <RequireAuth>
                                    <Navbar/>
                                    <Users />
                                </RequireAuth>
                            }
                        />
                </Routes>
            </div>
        </Router>
    )
}

export default App
