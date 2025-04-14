import { useContext } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { DashboardContext } from "../../Context/DashboardContext"


const COLORS = ["#4F46E5", "#14B8A6", "#F59E0B", "#EF4444", "#6366F1", "#10B981"];


const CategoryWiseSpends = () => {

    const { totalSpending, categoryData } = useContext(DashboardContext)

    return (
        <div className="bg-gray-100 p-6 sm:p-10 md:p-12 rounded-2xl shadow-md max-w-6xl mx-auto text-center transition-transform duration-300 ease-in-out mt-12 sm:mt-20 md:mt-24 mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-4 sm:mb-6 md:mb-8">Category-Wise Spending</h2>

            {/* Info Box */}
            <div className="my-6 sm:my-8 md:my-12 bg-indigo-100 p-5 sm:p-4 md:p-8 rounded-lg shadow-md max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
                <p className="text-base sm:text-lg md:text-xl text-gray-600">Total Amount Spent (Week)</p>
                <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl mt-2 text-indigo-500">{totalSpending}</h2>
            </div>

            {/* Chart Container */}
            <div className="flex flex-col items-center bg-white p-8 sm:p-10 md:p-12 shadow-2xl rounded-2xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius="75%"
                                innerRadius="45%"
                                dataKey="total"
                                nameKey="category"
                                label
                                labelLine={false}
                                className="transition-all duration-300"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="white"
                                        strokeWidth={2}
                                        className="hover:scale-105 sm:hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg"
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="square" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>



    )
}

export default CategoryWiseSpends