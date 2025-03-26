import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterForm from "./components/Auth/RegisterForm";
import LoginForm from "./components/Auth/LoginForm";
import ProtectedRoute from "./middleware/ProtectedRoute";
import ForgotPassword from "./components/Auth/ForgotPasswordForm";
import ResetPassword from "./components/Auth/ResetPasswordForm";
import FileUpload from "./components/FileUpload";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import InvoiceTable from "./components/InvoiceTable";
import UserProfileForm from "./components/UserProfileForm";
import SettingsPage from "./components/Settings";
import ChangePasswordForm from "./components/Auth/ChangePasswordForm";
import Dashboard from "./components/Dashboard/Dashboard";


const App = () => {

  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Determine if current route is a public (auth) route
  const isAuthRoute = ["/login", "/register", "/forgot-password", "/reset-password"].some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden">      
      {token && !isAuthRoute && (
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {token && !isAuthRoute && <Navbar setIsSidebarOpen={setIsSidebarOpen} />}

        {/* Main Content Area */}        
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50 to-white">
          <Routes>
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/upload-invoice" element={<ProtectedRoute element={<FileUpload />} />} />
            <Route path="/invoice-table" element={<ProtectedRoute element={<InvoiceTable />} />} />
            <Route path="/user-profile" element={<ProtectedRoute element={<UserProfileForm />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
            <Route path="/change-password" element={<ProtectedRoute element={<ChangePasswordForm />} />} />

            {/* Public Routes */}
            <Route path="/login" element={!token ? <LoginForm /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!token ? <RegisterForm /> : <Navigate to="/dashboard" replace />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </div>

  );
};

export default App;




