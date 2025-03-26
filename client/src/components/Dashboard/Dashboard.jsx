import React, { useContext, useEffect, useState } from "react";
import NavbarSecond from "../Navbar/NavbarSecond";
import DashboardCard from "./DashboardCard";
import { Briefcase, PieChart, Calendar, Receipt, List } from "lucide-react";
import { GenerateContext } from "../../Context/ContextAPI";
import axios from "axios";


const dashboardData = [
  { title: "54k", path: "/", description: "Total Amount Spend", icon: <Briefcase className="w-10 h-10 text-blue-600" /> },
  { title: "54k", path: "/", description: "Category Wise Amount Spend", icon: <PieChart className="w-10 h-10 text-green-600" /> },
  { title: "54k", path: "/", description: "Day Wise Amount Spend", icon: <Calendar className="w-10 h-10 text-yellow-600" /> },
  { title: "54k", path: "/", description: "Total Receipts", icon: <Receipt className="w-10 h-10 text-purple-600" /> },
  { title: "54k", path: "/", description: "Total Categories", icon: <List className="w-10 h-10 text-red-600" /> },
];

const Dashboard = () => {

  const { userName } = useContext(GenerateContext)

  const [invoiceCount, setInvoiceCount] = useState(0)
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  //* total receipt count
  useEffect(() => {
    const fetchInvoiceCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user-invoices", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` // Assuming JWT auth
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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
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
      console.error("Error fetching invoices:", error);
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
