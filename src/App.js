import React, {useState, useEffect, useContext} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom"
import './styles/App.css';
import Home from "./Home";

const App = () => {


    return (
        <Router>
            <div className="App">
                <Routes>
                        <Route
                            path="/"
                            element={
                                    <Home />
                            }
                        />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
