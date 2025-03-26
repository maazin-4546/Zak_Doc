import React, { useContext, useEffect, useState } from "react";
import NavbarSecond from "../Navbar/NavbarSecond";
import DashboardCard from "./DashboardCard";
import { Briefcase, PieChart, Calendar, Receipt, List } from "lucide-react";
import { NavbarContext } from "../../Context/NavbarContext";
import axios from "axios";
import { DashboardContext } from "../../Context/DashboardContext";


const dashboardData = [
  { title: "54k", path: "/", description: "Total Amount Spend", icon: <Briefcase className="w-10 h-10 text-blue-600" /> },
  { title: "54k", path: "/", description: "Category Wise Amount Spend", icon: <PieChart className="w-10 h-10 text-green-600" /> },
  { title: "54k", path: "/", description: "Day Wise Amount Spend", icon: <Calendar className="w-10 h-10 text-yellow-600" /> },
  { title: "54k", path: "/", description: "Total Receipts", icon: <Receipt className="w-10 h-10 text-purple-600" /> },
  { title: "54k", path: "/", description: "Total Categories", icon: <List className="w-10 h-10 text-red-600" /> },
];

const Dashboard = () => {

  const { userName } = useContext(NavbarContext)
  const { totalInvoiceAmount, invoiceCount } = useContext(DashboardContext)

  return (
    <div>
      <NavbarSecond title="Dashboard" path="/ Dashboard" />
      <div>
        <div className="mt-8 md:ml-8 sm:text-left text-center">
          <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
          <p className="text-gray-500">Welcome to Your Dashboard!</p>
        </div>
        <div className="p-6">

          <div className="flex justify-center items-center space-x-4 flex-wrap">
            <DashboardCard
              title={totalInvoiceAmount}
              description={"Total Amount Spend"}
              icon=<Briefcase className="w-10 h-10 text-blue-600" />
              path={"/"}
            />
            <DashboardCard
              title={"None"}
              description={"Category Wise Amount Spend"}
              icon=<PieChart className="w-10 h-10 text-green-600" />
              path={"/"}
            />
            <DashboardCard
              title={"None"}
              description={"Day Wise Amount Spend"}
              icon=<Calendar className="w-10 h-10 text-yellow-600" />
              path={"/"}
            />
            <DashboardCard
              title={invoiceCount}
              description={"Total Receipts Uploaded"}
              icon=<Receipt className="w-10 h-10 text-purple-600" />
              path={"/"}
            />
            <DashboardCard
              title={"None"}
              description={"Total Categories"}
              icon=<List className="w-10 h-10 text-red-600" />
              path={"/"}
            />

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
