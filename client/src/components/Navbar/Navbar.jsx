import { useState, useEffect, useContext, useRef } from "react";
import { ChevronDown, Menu, Search, Globe, User, Settings, LogOut, Check } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Navbar({ setIsSidebarOpen }) {


    const languageRef = useRef(null);
    const profileRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");



    useEffect(() => {
        const handleClickOutside = (e) => {
            if (languageRef.current && !languageRef.current.contains(e.target)) {
                setLanguageOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                    const email = decodedToken?.email?.trim() || "";

                    // Capitalize first letter of each name
                    const formatName = (name) =>
                        name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

                    const fullName = `${formatName(firstName)} ${formatName(lastName)}`.trim();

                    setUserName(fullName || "Guest");
                    setUserEmail(email || "Guest@gmail.com");
                } else {
                    setUserName("Guest");
                    setUserEmail("Guest@gmail.com");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                setUserName("Guest");
                setUserEmail("Guest@gmail.com");
            }
        } else {
            setUserName("Guest");
            setUserEmail("Guest@gmail.com");
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
            toast.success("logout Successfully")
            setIsLoggedIn(false);
            navigate("/login");
        } catch (error) {
            toast.error("Something went wrong")
            console.error("Logout failed", error);
        }
    };

    const languages = [
        { code: "us", name: "English" },
        { code: "es", name: "Español" },
        { code: "fr", name: "Français" },
        { code: "de", name: "Deutsch" },
    ];

    return (
        <header className="bg-white w-full border-b border-gray-200 shadow-md px-6 py-2 z-10">
            <ToastContainer />
            <div className="flex justify-between items-center w-full">

                {/* Hamburger Icon for Mobile */}
                <div className="flex items-center space-x-3">
                    <button
                        className="block md:hidden p-2 border rounded-md hover:bg-gray-100"
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Search Field */}
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 placeholder-gray-500 w-64 transition-shadow shadow-sm hover:shadow-md"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            className="cursor-pointer flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition shadow-sm border border-gray-300"
                            onClick={() => setLanguageOpen(!languageOpen)}
                        >
                            <Globe size={18} />
                            <span className="hidden md:inline text-sm font-medium">{selectedLanguage}</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${languageOpen ? "rotate-180" : "rotate-0"}`} />
                        </button>

                        {languageOpen && (
                            <div ref={languageRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                                <ul className="py-2 text-gray-700">
                                    {languages.map((lang) => (
                                        <li
                                            key={lang.code}
                                            className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedLanguage(lang.name);
                                                setLanguageOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <img src={`https://flagcdn.com/w40/${lang.code}.png`} alt={lang.name} className="w-5 h-4 rounded" />
                                                <span>{lang.name}</span>
                                            </div>
                                            {selectedLanguage === lang.name && <Check size={16} className="text-indigo-600" />}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Profile Section */}
                    <div className="relative">
                        <div
                            className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <img
                                src="https://randomuser.me/api/portraits/men/45.jpg"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                            />
                            <div className="leading-4 hidden md:block">
                                <h4 className="font-semibold">{userName}</h4>
                                <span className="text-xs text-gray-600">{userEmail}</span>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : "rotate-0"}`}
                            />
                        </div>

                        {menuOpen && (
                            <div ref={profileRef} className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                                <ul className="py-2 text-gray-700">
                                    <Link to="/user-profile" className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                        <User size={18} /> <span>Profile</span>
                                    </Link>
                                    <Link to="/settings" className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                        <Settings size={18} /> <span>Settings</span>
                                    </Link>
                                    <li onClick={handleLogout} className="px-4 py-2 flex items-center space-x-2 hover:bg-red-100 cursor-pointer text-red-600">
                                        <LogOut size={18} /> <span>Sign Out</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
