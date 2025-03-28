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
        const fetchCategoryWiseSpending = async () => {
            try {
                if (!token) {
                    console.error("No token found. User is not authenticated.");
                    return;
                }

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
    }, [filter]);


    // * Receipt count based on category
    useEffect(() => {
        const fetchCategoryCount = async () => {
            try {
                if (!token) {
                    console.error("No token found. User is not authenticated.");
                    return;
                }

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
    }, [filter]);



    //* Total weekly spendings(Line Chart)
    const fetchWeeklySpending = async (filter) => {
        try {
            if (!token) {
                console.error("No token found. User is not authenticated.");
                return [];
            }

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
        const getData = async () => {
            const data = await fetchWeeklySpending(filter);
            setWeeklyData(data);
        };
        getData();
    }, [filter]);


    //! Main filter s
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage

                if (!token) {
                    console.error("No token found. User is not authenticated.");
                    return;
                }

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
    }, [filter]);


    return (
        <DashboardContext.Provider value={{ categoryCounts, totalReceipts, categoryData, totalSpending, weeklyData, filter, setFilter, totalCategories }}>
            {children}
        </DashboardContext.Provider>
    )
}

