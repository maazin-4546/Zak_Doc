import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import ProtectedRoute from "./middleware/ProtectedRoute";
import ForgotPassword from "./components/ForgotPasswordForm";
import ResetPassword from "./components/ResetPasswordForm";

// maazin.noorisys@gmail.com
// Mazinabd@4546
// Ma@zin123

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

    <div>
      <Routes>
        {/* Public Routes: Accessible only if NOT logged in */}
        <Route path="/login" element={!token ? <LoginForm /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!token ? <RegisterForm /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Route: Accessible only if logged in */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
      </Routes>
    </div>

  );
};

export default App;

