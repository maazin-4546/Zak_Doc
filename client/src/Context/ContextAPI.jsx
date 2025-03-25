import axios from 'axios';
import { createContext } from 'react'
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";



export const GenerateContext = createContext()

export const ContextProvider = ({ children }) => {

    const [invoices, setInvoices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [jsonData, setJsonData] = useState(null);

    return (
        <GenerateContext.Provider value={{ invoices, setInvoices, isOpen, setIsOpen, jsonData, setJsonData }}>
            {children}
        </GenerateContext.Provider>
    )
}

