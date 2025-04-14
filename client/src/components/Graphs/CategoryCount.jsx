import { useContext } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { DashboardContext } from "../../Context/DashboardContext";

const COLORS = ["#2C3E50", "#8E44AD", "#E67E22", "#C0392B", "#1ABC9C", "#34495E"];


const CategoryCount = () => {

    const { totalReceipts, categoryCounts } = useContext(DashboardContext);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-md">
                    <p className="text-lg font-bold">{payload[0].payload._id}</p>
                    <p className="text-base">Receipts: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-100 p-6 sm:p-10 md:p-12 rounded-2xl shadow-md max-w-7xl w-full mx-auto text-center transition-transform duration-300 ease-in-out mt-12 sm:mt-20 md:mt-24 mb-12 sm:mb-16 md:mb-20">
            {/* Main Container */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-4 sm:mb-6 md:mb-8">Category Count</h2>

            {/* Info Box */}
            <div className="my-6 sm:my-8 md:my-12 bg-indigo-100 p-5 sm:p-4 md:p-8 rounded-lg shadow-md max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
                <p className="text-base sm:text-lg md:text-xl text-gray-600">Category-wise Receipt Count</p>
                <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl mt-2 text-indigo-500">{totalReceipts}</h2>
            </div>

            {/* Chart Container */}
            <div className="flex flex-col items-center bg-white p-8 sm:p-10 md:p-12 shadow-2xl rounded-2xl w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto">
                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryCounts}
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                innerRadius="50%"
                                dataKey="count"
                                nameKey="_id"
                                label
                                labelLine={false}
                                className="transition-all duration-300"
                            >
                                {categoryCounts.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="white"
                                        strokeWidth={2}
                                        className="hover:scale-105 sm:hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CategoryCount;
