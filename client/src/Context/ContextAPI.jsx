import { createContext } from 'react'
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";


export const GenerateContext = createContext()

export const ContextProvider = ({ children }) => {

    const [invoices, setInvoices] = useState([]);

    return (
        <GenerateContext.Provider value={{ invoices, setInvoices }}>
            {children}
        </GenerateContext.Provider>
    )
}

