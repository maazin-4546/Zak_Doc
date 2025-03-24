import axios from 'axios';
import { createContext } from 'react'
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";



export const GenerateContext = createContext()

export const ContextProvider = ({ children }) => {

    const [invoices, setInvoices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [jsonData, setJsonData] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first!");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        // Get token from localStorage
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("http://localhost:5000/extract", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setJsonData(response.data.data);
                toast.success("Data extracted successfully!", { position: "top-right", autoClose: 3000 });
                setIsOpen(true);    //! modal open here
            } else {
                setError("Failed to extract data");
                toast.error("Failed to extract data", { position: "top-right" });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Something went wrong";
            setError(errorMessage);
            toast.error(errorMessage, { position: "top-right" });
        }

        setLoading(false);
    };

    return (
        <GenerateContext.Provider value={{ invoices, setInvoices, isOpen, setIsOpen, jsonData, setJsonData, handleUpload }}>
            {children}
        </GenerateContext.Provider>
    )
}

