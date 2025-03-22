import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./middleware/ProtectedRoute";
import ForgotPassword from "./components/ForgotPasswordForm";
import ResetPassword from "./components/ResetPasswordForm";
import FileUpload from "./components/FileUpload";
import Navbar from "./components/Navbar2";
import Sidebar from "./components/Sidebar2";
import InvoiceTable from "./components/InvoiceTable";


const App = () => {

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (

    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Navbar />

        {/* Protected Route: Accessible only if logged in */}
        <div className="flex-1 p-6">
          <div className="table-container">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute element={<FileUpload />} />} />
              <Route path="/invoice-table" element={<ProtectedRoute element={<InvoiceTable />} />} />
            </Routes>
          </div>
        </div>

        {/* Public Routes: Accessible only if NOT logged in */}
        <Routes>
          <Route path="/login" element={!token ? <LoginForm /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!token ? <RegisterForm /> : <Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>


  );
};

export default App;

