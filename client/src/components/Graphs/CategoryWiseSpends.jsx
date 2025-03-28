import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import NavbarSecond from "../Navbar/NavbarSecond";
import { DashboardContext } from "../../Context/DashboardContext";


const COLORS = ["#4F46E5", "#14B8A6", "#F59E0B", "#EF4444", "#6366F1", "#10B981"];


const CategoryWiseSpends = () => {

    const { totalSpending, categoryData } = useContext(DashboardContext)

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-md">
                    <p className="text-lg font-bold">{payload[0].payload.category}</p>
                    <p className="text-base">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };


    return (
        <>
            {/* <NavbarSecond title="Category-Wise Spend's" path="/ Dashboard / Category" /> */}

            {/* Main Container */}
            <div className="bg-gray-50 p-6 sm:p-10 rounded-lg shadow-md max-w-6xl mx-auto text-center transition-transform duration-300 ease-in-out mt-16 sm:mt-24 mb-16 sm:mb-20">
                <h2 className="mt-4 sm:mt-8 text-3xl sm:text-4xl text-gray-800">Category-Wise Spending</h2>

                {/* Info Box */}
                <div className="my-8 sm:my-12 bg-indigo-100 p-5 sm:p-8 rounded-md shadow-sm max-w-5xl mx-auto">
                    <p className="text-lg sm:text-xl text-gray-600">Total Amount Spend's (Week)</p>
                    <h2 className="font-extrabold text-3xl sm:text-4xl text-indigo-500">{totalSpending}</h2>
                </div>

                {/* Chart Container - Increased Width */}
                <div className="flex flex-col items-center bg-white p-10 shadow-xl rounded-xl w-full max-w-5xl mx-auto">
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                dataKey="total"
                                nameKey="category"
                                labelLine={false}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="white"
                                        strokeWidth={2}
                                        className="hover:scale-105 transition-transform duration-300"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" align="center" layout="vertical" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>

    )
}

export default CategoryWiseSpends