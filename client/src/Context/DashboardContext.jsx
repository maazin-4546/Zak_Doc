import axios from 'axios';
import { createContext } from 'react'
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";


export const DashboardContext = createContext()

export const DashboardContextProvider = ({ children }) => {

    const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

    const [categoryCounts, setCategoryCounts] = useState([]);
    const [totalReceipts, setTotalReceipts] = useState(0);

    const token = localStorage.getItem('token');

    //* sum of total amount
    const getUserInvoicesTotal = async () => {
        try {
            if (!token) {
                console.warn("No token found");
                return;
            }

            const response = await axios.get("http://localhost:5000/api/user-invoices", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const invoices = response.data.data;
                const totalSum = invoices.reduce((acc, invoice) => {
                    const amount = parseFloat(invoice.total.replace(/[^0-9.]/g, "")) || 0;
                    return acc + amount;
                }, 0);
                return totalSum;
            }
        } catch (error) {
            console.warn("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        const fetchTotal = async () => {
            const sum = await getUserInvoicesTotal();
            if (sum !== undefined) {
                setTotalInvoiceAmount(sum);
            }
        };
        fetchTotal();
    }, []);


    // * Receipt count based on category
    useEffect(() => {
        const fetchCategoryCount = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/invoice-category-count", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setCategoryCounts(response.data.data);  
                    setTotalReceipts(response.data.totalReceipts); 
                } else {
                    console.log("Failed to fetch data");
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchCategoryCount();
    }, []);


    return (
        <DashboardContext.Provider value={{ totalInvoiceAmount, categoryCounts, totalReceipts }}>
            {children}
        </DashboardContext.Provider>
    )
}

