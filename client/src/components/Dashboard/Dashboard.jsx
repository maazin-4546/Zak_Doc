import React, { useContext } from "react";
import NavbarSecond from "../Navbar/NavbarSecond";
import DashboardCard from "./DashboardCard";
import { Briefcase, PieChart, Receipt } from "lucide-react";
import { NavbarContext } from "../../Context/NavbarContext";
import { DashboardContext } from "../../Context/DashboardContext";
import CategoryWiseSpends from "../Graphs/CategoryWiseSpends";
import CategoryCount from "../Graphs/CategoryCount";
import TotalWeeklySpending from "../Graphs/TotalWeeklySpending";


const Dashboard = () => {

  const { userName } = useContext(NavbarContext)
  const { totalInvoiceAmount, totalReceipts } = useContext(DashboardContext)

  return (
    <div>
      <NavbarSecond title="Dashboard" path="/ Dashboard" />

      {/* Top Part */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4">
        <div className="mt-4 md:mt-8 md:ml-8 sm:text-left text-center w-full md:w-auto">
          <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
          <p className="text-gray-500">Welcome to Your Dashboard!</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto md:mr-8 md:w-1/4">
          <label className="text-lg text-gray-600 font-semibold whitespace-nowrap">Filter By:</label>
          <select
            className="w-full sm:w-auto flex-grow rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm 
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All" className="font-bold">All Time</option>
            <option value="Office & Business Expenses">Last 7 Days</option>
            <option value="Office & Business Expenses">Last 14 Days</option>
            <option value="Office & Business Expenses">Last 1 Month</option>
            <option value="Office & Business Expenses">Last 3 Months</option>
            <option value="Office & Business Expenses">Last 6 Months</option>
            <option value="Office & Business Expenses">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="p-6">
        <div className="flex justify-center items-center space-x-4 flex-wrap">
          <DashboardCard
            title={totalInvoiceAmount}
            description={"Total Amount Spend"}
            icon={<Briefcase className="w-10 h-10 text-blue-600" />}
          />
          <DashboardCard
            title={totalReceipts}
            description={"Total Receipts Uploaded"}
            icon={<Receipt className="w-10 h-10 text-purple-600" />}
          />
          <DashboardCard
            title={"05"}
            description={"Total Categories"}
            icon={<PieChart className="w-10 h-10 text-green-600" />}
          />
        </div>
      </div>

      {/* Graphs */}
      <div className="p-4">
        <div className="mb-2 w-full">
          <TotalWeeklySpending />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-2 rounded-lg">
            <CategoryWiseSpends />
          </div>
          <div className="p-2 rounded-lg">
            <CategoryCount />
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
