import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthContextProvider} from "./AuthorizationContext"
import {ChakraProvider} from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <AuthContextProvider>
                <App/>
            </AuthContextProvider>
        </ChakraProvider>
    </React.StrictMode>
);

reportWebVitals();
