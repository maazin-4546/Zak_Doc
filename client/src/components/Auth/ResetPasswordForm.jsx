import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ResetPassword = () => {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { token } = useParams(); // Extract token from URL


    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/user/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            toast.success("Password Reset Successfully")

            if (res.ok) {
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
            }
        } catch (error) {
            toast.error("Something went wrong. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <ToastContainer />
            <div className="max-w-md w-full bg-white backdrop-blur-lg shadow-xl rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>

                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <button
                        className="mt-4 bg-indigo-500 text-white cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-400 transition duration-200 w-full"
                        type="submit"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
