import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NavbarSecond from './Navbar/NavbarSecond';

export default function UserProfileForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found in local storage");

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;

                const response = await axios.get(`http://localhost:5000/user/single-user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = response.data.user;

                // Optional: ensure only needed fields are set
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                });

            } catch (error) {
                console.error("Error fetching user:", error.message);
            }
        };

        getUserData();
    }, []);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            const response = await axios.put(
                `http://localhost:5000/user/update-user/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        console.log('Profile picture selected:', file);
    };

    return (
        <>
            <NavbarSecond title={"User's Profile"} path={" / User / Profile"} />
            <ToastContainer />
            <div className="flex items-center justify-center p-6">
                <div className="w-full bg-white shadow-xl rounded-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-lg text-gray-500">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div className="relative">
                            <label htmlFor="profilePic" className="cursor-pointer">
                                <FaUserCircle className="text-5xl text-gray-400 hover:text-gray-600 transition duration-200" />
                                <input
                                    type="file"
                                    id="profilePic"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                />
                            </label>
                            <p className="text-xs text-center text-gray-500 mt-1">Change</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                            />
                        </div>
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
}
