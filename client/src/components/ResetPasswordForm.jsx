import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"

const ResetPassword = () => {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
            setSuccess(data.msg);

            if (res.ok) {
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="shadow-gray-800 max-w-md w-full bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-700">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Reset Password</h2>
                {error && <p className="text-red-500 text-center font-medium my-4">{error}</p>}
                {success && <p className="text-green-500 text-center font-medium my-4">{success}</p>}
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-900 transition-all duration-300"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200 transition duration-200"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    <button
                        className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg"
                        type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
