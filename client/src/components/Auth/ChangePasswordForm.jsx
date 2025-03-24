import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaKey, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarSecond from '../Navbar/NavbarSecond';


const ChangePasswordForm = () => {
    
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("User not logged in");
                return;
            }

            const decoded = jwtDecode(token);
            const userId = decoded.userId; // Adjust according to your JWT structure

            const response = await axios.put(
                `http://localhost:5000/user/update-user-password/${userId}`,
                {
                    currentPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                    confirmNewPassword: formData.confirmNewPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(response.data.message || "Password changed successfully");
            localStorage.removeItem("token");
            window.location.reload();
            setTimeout(() => navigate("/login"), 2000);            

            // Clear the form after success
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });

        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Password update failed");
        }
    };

    return (
        <>
            <NavbarSecond title="Change Password" path=" / Password / Change Password" />
            <div className="flex items-center justify-center px-6 py-10">
            <ToastContainer />
                <div className="w-full bg-white rounded-xl shadow-xl p-10 transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Change Your Password</h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">
                        Keep your account safe by updating your password regularly.
                    </p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Old Password */}
                        <div className="relative">
                            <label className="text-sm text-gray-600 block mb-1 font-medium">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.old ? "text" : "password"}
                                    name="oldPassword"
                                    placeholder="Enter current password"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 text-gray-800 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                    required
                                />
                                <FaKey className="absolute left-3 top-3 text-gray-400" size={18} />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("old")}
                                    className="cursor-pointer absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword.old ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="relative">
                            <label className="text-sm text-gray-600 block mb-1 font-medium">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 text-gray-800 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                    required
                                />
                                <FaLock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("new")}
                                    className="cursor-pointer absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative md:col-span-2">
                            <label className="text-sm text-gray-600 block mb-1 font-medium">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmNewPassword"
                                    placeholder="Re-enter new password"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 text-gray-800 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                    required
                                />
                                <FaLock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("confirm")}
                                    className="cursor-pointer absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="mt-4 bg-indigo-500 text-white cursor-pointer py-2 px-4 rounded-lg hover:bg-indigo-400 transition duration-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordForm;
