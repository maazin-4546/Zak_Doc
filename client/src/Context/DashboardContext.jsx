import axios from 'axios';
import { createContext } from 'react'
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";


export const DashboardContext = createContext()

export const DashboardContextProvider = ({ children }) => {

    const [categoryCounts, setCategoryCounts] = useState([]);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [totalSpending, setTotalSpending] = useState(0);
    const [weeklyData, setWeeklyData] = useState([]);


    const token = localStorage.getItem('token');

    //* category-wise spending and total amount
    useEffect(() => {
        const fetchCategoryWiseSpending = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/categorywise-spending", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setCategoryData(response.data.data);
                    setTotalSpending(response.data.totalSpending);
                } else {
                    console.log("Failed to fetch data");
                }
            } catch (err) {
                console.error("Error fetching category-wise spending:", err);
            }
        };

        fetchCategoryWiseSpending();
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


    //* Total weekly spendings(Line Chart)
    const fetchWeeklySpending = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/user-weekly-amounts", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            return response.data.success ? response.data.data : [];
        } catch (error) {
            console.error("Error fetching weekly spending:", error);
            return [];
        }
    };

    useEffect(() => {
        const getData = async () => {
            const data = await fetchWeeklySpending();
            setWeeklyData(data);
        };

        getData();
    }, []);


    return (
        <DashboardContext.Provider value={{ categoryCounts, totalReceipts, categoryData, totalSpending, weeklyData }}>
            {children}
        </DashboardContext.Provider>
    )
}

