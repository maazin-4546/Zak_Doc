import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                // Decode JWT token payload
                const base64Url = token.split(".")[1];
                if (base64Url) {
                    const decodedToken = JSON.parse(atob(base64Url));

                    const firstName = decodedToken?.firstName?.trim() || "";
                    const lastName = decodedToken?.lastName?.trim() || "";

                    // Capitalize first letter of each name
                    const formatName = (name) =>
                        name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

                    const fullName = `${formatName(firstName)} ${formatName(lastName)}`.trim();

                    setUserName(fullName || "Guest");
                } else {
                    setUserName("Guest");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                setUserName("Guest");
            }
        } else {
            setUserName("Guest");
        }
    }, []);

    // Check login status on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/user/logout", {
                method: "POST",
                credentials: "include",
            });

            localStorage.removeItem("token");
            window.location.reload();
            setIsLoggedIn(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        {/* Sidebar Toggle Button */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="inline-flex items-center p-2 text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>

                            {/* Brand Logo */}
                            <a href="#" className="flex items-center ms-2 md:me-24">
                                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-gray-800">ZakDoc</span>
                            </a>
                        </div>

                        {/* User Profile Section */}
                        <div className="relative flex items-center space-x-3">

                            <button
                                type="button"
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 cursor-pointer"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                            </button>

                            {/* Display User Name */}
                            <span className="text-gray-800 font-medium hidden sm:inline">{userName}</span>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-48 w-32 bg-white rounded-lg shadow-lg">
                                    <ul className="py-2 text-gray-700">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                                        </li>
                                        <li onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>


            <aside
                className={`fixed top-0 left-0 z-40 w-56 h-screen pt-24 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0 bg-white border-r border-gray-300 shadow-sm`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-800 rounded-lg hover:bg-gray-200">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <Link to="/login" className="flex items-center p-2 text-gray-800 rounded-lg hover:bg-gray-200">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="ms-3">Login</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="flex items-center p-2 text-gray-800 rounded-lg hover:bg-gray-200">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="ms-3">Register</span>
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-800 rounded-lg hover:bg-gray-200">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="ms-3">Products</span>
                            </a>
                        </li>


                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
