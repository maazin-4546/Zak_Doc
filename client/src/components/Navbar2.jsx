import { useState } from "react";
import { ChevronDown, Menu, Search, Globe, User, Settings, LogOut, Check } from "lucide-react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const languages = [
        { code: "us", name: "English" },
        { code: "es", name: "Español" },
        { code: "fr", name: "Français" },
        { code: "de", name: "Deutsch" }
    ];

    return (
        <header className="bg-white w-full border-b border-gray-200 shadow-md">


            {/* Right Section - Profile & Language */}
            <div className="flex justify-end items-center space-x-6">

                {/* Language Selector */}
                <div className="relative">
                    <button
                        className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition shadow-sm border border-gray-300"
                        onClick={() => setLanguageOpen(!languageOpen)}
                    >
                        <Globe size={18} />
                        <span className="hidden md:inline text-sm font-medium">{selectedLanguage}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${languageOpen ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    {languageOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                            <ul className="py-2 text-gray-700">
                                {languages.map((lang) => (
                                    <li
                                        key={lang.code}
                                        className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                                        onClick={() => { setSelectedLanguage(lang.name); setLanguageOpen(false); }}
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
                        className="flex items-center space-x-3 px-4 py-2 cursor-pointer mr-6"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <img
                            src="https://randomuser.me/api/portraits/men/45.jpg"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                        />
                        <div className="leading-4 hidden md:block">
                            <h4 className="font-semibold">John Doe</h4>
                            <span className="text-xs text-gray-600">johndoe@gmail.com</span>
                        </div>
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : "rotate-0"}`}
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-4 mt-2 w-38 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                            <ul className="py-2 text-gray-700">
                                <li className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                    <User size={18} /> <span>Profile</span>
                                </li>
                                <li className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                    <Settings size={18} /> <span>Settings</span>
                                </li>
                                <li className="px-4 py-2 flex items-center space-x-2 hover:bg-red-100 cursor-pointer text-red-600">
                                    <LogOut size={18} /> <span>Sign Out</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

        </header>
    );
}
