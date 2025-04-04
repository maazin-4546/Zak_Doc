import { useEffect, useState } from "react";
import {
    Home,
    FileText,
    Upload,
    BarChart,
    Layers,
    Settings,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sampleItems = [
    { id: 1, path: "/dashboard", icon: <Home size={20} />, text: "Dashboard" },
    { id: 2, path: "/upload-invoice", icon: <Upload size={20} />, text: "Upload Invoice" },
    { id: 3, path: "/invoice-table", icon: <FileText size={20} />, text: "Invoice Data" },
    { id: 4, path: "/reports", icon: <BarChart size={20} />, text: "Reports" },
    { id: 5, path: "/integrations", icon: <Layers size={20} />, text: "Integrations" },
    { id: 6, path: "/settings", icon: <Settings size={20} />, text: "Settings" },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {

    const location = useLocation();
    const [expanded, setExpanded] = useState(true);

    // Close sidebar when clicking outside on small screens (optional enhancement)
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setIsSidebarOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [setIsSidebarOpen]);

    return (
        <>
            {/* BACKDROP for small screens */}
            <div
                className={`fixed inset-0 bg-blend-color-burn bg-opacity-40 z-30 transition-opacity duration-300 ${isSidebarOpen ? "block" : "hidden"}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>



            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-full min-h-screen z-40 bg-white border-r border-gray-300 
                transition-all duration-300 ease-in-out
                ${expanded ? "w-64" : "w-20"} 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:static md:translate-x-0 md:z-20`}
            >


                <nav className="h-full flex flex-col w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {/* Logo and Toggle */}
                    <div className="pt-6 px-4 pb-2 flex justify-between items-center">
                        {expanded && (
                            <img                                
                                src="/ZakDoc_Logo.JPG"
                                alt="Logo"
                                className="w-44 object-contain"
                            />
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setExpanded((curr) => !curr)}
                                className="hidden lg:block p-1.5 rounded-lg bg-gray-50 hover:bg-gray-200 cursor-pointer"
                            >
                                {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                            </button>

                            {/* Close button for mobile */}
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="block lg:hidden p-1.5 rounded-lg hover:bg-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Items */}
                    <ul className="flex-1 px-2 pt-6">
                        {sampleItems.map((item) => (
                            <SidebarItem key={item.id} {...item} expanded={expanded} active={location.pathname === item.path} />
                        ))}
                    </ul>

                    {/* Support & Premium */}
                    <div className="px-4 mt-auto w-full">
                        <div
                            className={`border-t border-gray-200 py-4 flex flex-col items-center ${expanded ? "text-center" : ""
                                }`}
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-10 mb-2" />
                            {expanded && (
                                <>
                                    <h4 className="text-gray-700 text-sm font-semibold mb-1">Need more support?</h4>
                                    <p className="text-gray-500 text-xs mb-2">Talk to an Accountant</p>
                                </>
                            )}
                        </div>
                        <div
                            className={`border-t border-gray-200 pt-4 pb-6 flex flex-col items-center ${expanded ? "text-center" : ""
                                }`}
                        >
                            {expanded ? (
                                <>
                                    <h4 className="text-gray-700 text-sm font-semibold mb-1">Go Premium!</h4>
                                    <p className="text-gray-500 text-xs mb-3 px-2">Upgrade your subscription plan to unlock all business insights!</p>
                                    <button className="bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-400 transition w-full">Upgrade Plan</button>
                                </>
                            ) : (
                                <button className="bg-indigo-500 text-white text-xs font-semibold p-2 rounded-lg hover:bg-indigo-400 transition">💎</button>
                            )}
                        </div>
                        {expanded && <p className="text-gray-400 text-xs text-center my-4">www.example.com</p>}
                    </div>
                </nav>
            </aside>
        </>
    );
}

function SidebarItem({ icon, text, active, expanded, path }) {
    return (
        <Link
            to={path}
            className={`relative flex items-center gap-3 py-2 px-3 my-1 w-full font-medium rounded-md cursor-pointer transition-colors group ${active
                ? "bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-800"
                : "hover:text-indigo-600 text-gray-600"
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span className={`transition-all whitespace-nowrap ${expanded ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"}`}>
                {text}
            </span>
        </Link>
    );
}
