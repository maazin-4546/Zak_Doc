import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

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
    )
}

export default Navbar