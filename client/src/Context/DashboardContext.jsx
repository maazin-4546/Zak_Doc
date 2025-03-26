import axios from 'axios';
import { createContext } from 'react'
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";


export const DashboardContext = createContext()

export const DashboardContextProvider = ({ children }) => {


    const [invoiceCount, setInvoiceCount] = useState(0)
    const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

    const token = localStorage.getItem('token');

    //* total receipt count
    useEffect(() => {
        const fetchInvoiceCount = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user-invoices", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` // Assuming JWT auth
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setInvoiceCount(data.data.length); // Count total invoices
                } else {
                    throw new Error(data.error || "Failed to fetch invoices");
                }
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchInvoiceCount();
    }, []);


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

    return (
        <DashboardContext.Provider value={{ totalInvoiceAmount, invoiceCount }}>
            {children}
        </DashboardContext.Provider>
    )
}

