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
    const [filter, setFilter] = useState("all");
    const [weeklySpending, setWeeklySpending] = useState([]);
    const [categorySpending, setCategorySpending] = useState([]);
    const [invoiceCategoryCount, setInvoiceCategoryCount] = useState([]);
    const [totalCategories, setTotalCategories] = useState(0);

    const token = localStorage.getItem('token');

    //* category-wise spending and total amount
    useEffect(() => {
        if (!token) {
            console.log("User is logged out, skipping fetchCategoryWiseSpending.");
            return;
        }

        const fetchCategoryWiseSpending = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/categorywise-spending?filter=${filter}`, {
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
    }, [filter, token]);


    // * Receipt count based on category
    useEffect(() => {
        if (!token) {
            console.log("User is logged out, skipping fetchCategoryCount.");
            return;
        }

        const fetchCategoryCount = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/invoice-category-count?filter=${filter}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setCategoryCounts(response.data.data);
                    setTotalReceipts(response.data.totalReceipts);
                    setTotalCategories(response.data.totalCategories);
                } else {
                    console.log("Failed to fetch data");
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchCategoryCount();
    }, [filter, token]);


    //* Total weekly spendings(Line Chart)
    const fetchWeeklySpending = async (filter) => {
        if (!token) {
            console.log("User is logged out, skipping fetchWeeklySpending.");
            return [];
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/user-weekly-amounts?filter=${filter}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data.success ? response.data.data : [];
        } catch (error) {
            console.error("Error fetching weekly spending:", error);
            return [];
        }
    };


    useEffect(() => {
        if (!token) {
            console.log("User is logged out, skipping weekly data fetch.");
            return;
        }

        const getData = async () => {
            const data = await fetchWeeklySpending(filter);
            setWeeklyData(data);
        };

        getData();
    }, [token, filter]); 


    //! Main filter s
    useEffect(() => {
        if (!token) {
            console.log("User is logged out, skipping fetchData.");
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [weeklyRes, categoryRes, invoiceRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/user-weekly-amounts?filter=${filter}`, { headers }),
                    axios.get(`http://localhost:5000/api/categorywise-spending?filter=${filter}`, { headers }),
                    axios.get(`http://localhost:5000/api/invoice-category-count?filter=${filter}`, { headers })
                ]);

                setWeeklySpending(weeklyRes.data.data);
                setCategorySpending(categoryRes.data.data);
                setInvoiceCategoryCount(invoiceRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token, filter]); 



    return (
        <DashboardContext.Provider value={{ categoryCounts, totalReceipts, categoryData, totalSpending, weeklyData, filter, setFilter, totalCategories }}>
            {children}
        </DashboardContext.Provider>
    )
}

