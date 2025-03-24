import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const LoginForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            toast.success("Login Successful");

            localStorage.setItem("token", data.token);

            setTimeout(() => { navigate("/dashboard"); }, 2000);
            return data;

        } catch (err) {
            toast.error("Invalid Credentials");
        }
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen">
            <ToastContainer />
            <div className="max-w-md w-full bg-white backdrop-blur-lg shadow-xl rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-780">Welcome Back</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Log in to your account</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <FaEnvelope />
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <FaLock />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                required
                                autoComplete="off"
                            />
                            {/* Toggle Eye Icon */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200 transition duration-200"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-500 text-white cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-400 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                {/* Register & Forgot Password Links */}
                <div className="text-center mt-4">
                    <Link to="/forgot-password" className="text-gray-400 hover:text-gray-300 transition-all font-medium">
                        Forgot Password?
                    </Link>
                </div>

                <p className="text-center text-gray-400 mt-2">
                    Don't have an account?
                    <Link to="/register" className="text-indigo-500 hover:text-indigo-400 transition-all ml-1 font-semibold">
                        Register here
                    </Link>
                </p>
            </div>
        </div>


    );
};

export default LoginForm;
