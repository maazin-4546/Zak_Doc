import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import NavbarSecond from '../Navbar/NavbarSecond';
import { DashboardContext } from '../../Context/DashboardContext';

const TotalWeeklySpending = () => {

    const { totalInvoiceAmount } = useContext(DashboardContext)
    const [weeklyData, setWeeklyData] = useState([]);

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
        <>
            {/* <NavbarSecond title="Total Spend's" path="/ Dashboard / Total" /> */}
            {/* Main Container */}
            <div className="bg-gray-50 p-6 sm:p-10 rounded-lg shadow-md max-w-6xl mx-auto text-center transition-transform duration-300 ease-in-out mt-16 sm:mt-24 mb-16 sm:mb-20">
                <h2 className="mt-4 sm:mt-8 text-3xl sm:text-4xl text-gray-800">Total Amount</h2>

                {/* Info Box */}
                <div className="my-8 sm:my-12 bg-indigo-100 p-5 sm:p-8 rounded-md shadow-sm max-w-6xl mx-auto">
                    <p className="text-lg sm:text-xl text-gray-600">Total Amount Spend's (Week)</p>
                    <h2 className="font-extrabold text-3xl sm:text-4xl text-indigo-500">{totalInvoiceAmount}</h2>
                </div>

                {/* Chart Container */}
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200">
                    <ResponsiveContainer width="100%" height={350} sm:height={450}>
                        <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                            <XAxis dataKey="weekStart" stroke="#4A5568" />
                            <YAxis stroke="#4A5568" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    border: "1px solid #6366F1",
                                }}
                                labelStyle={{ fontWeight: "bold" }}
                                itemStyle={{ color: "#A5B4FC" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#6366F1"
                                strokeWidth={3}
                                dot={{ r: 6, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
                                activeDot={{ r: 10, fill: "#ffffff", stroke: "#6366F1", strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>

    )
}

export default TotalWeeklySpending