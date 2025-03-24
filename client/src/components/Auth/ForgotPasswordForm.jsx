import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/user/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            toast.success("Link sent to your email")
        } catch (error) {
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
        <ToastContainer/>
            <div className="max-w-md w-full bg-white backdrop-blur-lg shadow-xl rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Forgot Password</h2>

                <form onSubmit={handleForgotPassword} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                        required
                    />

                    <button
                        type="submit"
                        className="mt-4 bg-indigo-500 text-white cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-400 transition duration-200 w-full"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
