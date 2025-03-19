import { useState } from "react";

const ForgotPassword = () => {
    
    const [email, setEmail] = useState("");    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            setSuccess(data.msg);
        } catch (error) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="shadow-gray-800 max-w-md w-full bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-700">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Forget Password</h2>
                {error && <p className="text-red-500 text-center font-medium my-4">{error}</p>}
                {success && <p className="text-green-500 text-center font-medium my-4">{success}</p>}
                <form onSubmit={handleForgotPassword} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-900 transition-all duration-300"
                        required
                    />
                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
