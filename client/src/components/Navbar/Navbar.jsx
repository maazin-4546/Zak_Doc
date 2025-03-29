import { useState, useEffect, useContext, useRef } from "react";
import { ChevronDown, Menu, Search, Globe, User, Settings, LogOut, Check } from "lucide-react";
import { Link } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { NavbarContext } from "../../Context/NavbarContext";

export default function Navbar({ setIsSidebarOpen }) {

    const { userName, userEmail, setIsLoggedIn, handleLogout } = useContext(NavbarContext)

    const languageRef = useRef(null);
    const profileRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [selectedLanguageCode, setSelectedLanguageCode] = useState("us");



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

    const handleProfileClick = (e) => {
        e.stopPropagation();
        setMenuOpen((prev) => !prev);
    };

    const handleLanguageClick = (e) => {
        e.stopPropagation();
        setLanguageOpen((prev) => !prev);
    };



    // Check login status on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

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
                            onClick={handleLanguageClick}
                            ref={languageRef} // Track the language button
                        >
                            {/* Show the selected language flag */}
                            <img
                                src={`https://flagcdn.com/w40/${selectedLanguageCode}.png`}
                                alt={selectedLanguage}
                                className="w-5 h-4 rounded"
                            />
                            <span className="hidden md:inline text-sm font-medium">{selectedLanguage}</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${languageOpen ? "rotate-180" : "rotate-0"}`} />
                        </button>

                        {languageOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                                <ul className="py-2 text-gray-700">
                                    {languages.map((lang) => (
                                        <li
                                            key={lang.code}
                                            className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedLanguage(lang.name);
                                                setSelectedLanguageCode(lang.code); // Save the language code for flag
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
                    <div className="relative" ref={profileRef}>
                        <div
                            className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
                            onClick={handleProfileClick}
                        >

                            <User size={40} className="text-gray-500 bg-gray-200 rounded-full p-2" />

                            <div className="leading-4 hidden md:block">
                                <h4 className="font-semibold">{userName}</h4>
                                <span className="text-xs text-gray-600">{userEmail}</span>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : "rotate-0"}`}
                            />
                        </div>

                        {/* Profile Dropdown */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
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
