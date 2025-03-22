import { useState } from "react";

import { Home, FileText, Upload, BarChart, Layers, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sampleItems = [
    { id: 1, path: "/dashboard", icon: <Home size={20} />, text: "Dashboard", active: true },
    { id: 2, path: "/invoice-table", icon: <FileText size={20} />, text: "Invoice Data", active: false },
    { id: 3, path: "/login", icon: <Upload size={20} />, text: "Upload Invoice", active: false },
    { id: 4, path: "/login", icon: <BarChart size={20} />, text: "Reports", active: false },
    { id: 5, path: "/login", icon: <Layers size={20} />, text: "Integrations", active: false },
    { id: 6, path: "/login", icon: <Settings size={20} />, text: "Settings", active: false },
];


export default function Sidebar() {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside className={`h-screen ${expanded ? "w-64" : "w-16"} transition-all duration-300 flex flex-col`}>
            <nav className="h-full flex flex-col bg-white w-full border-r border-gray-300 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-2">
                {/* Logo & Toggle Button */}
                <div className="pt-10 p-4 pb-2 flex justify-between items-center">
                    <div>
                        <img src="https://img.logoipsum.com/243.svg" alt="Logo" className="w-32" />
                    </div>

                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                {/* Sidebar Items List */}
                <ul className="flex-1 px-3 pt-8">
                    {sampleItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            text={item.text}
                            active={item.active}
                            expanded={expanded}
                            path={item.path}
                        />
                    ))}
                </ul>

                {/* Need More Support Section */}
                <div className={`p-4 border-t border-gray-200 mt-4 flex flex-col justify-center items-center ${!expanded ? "hidden" : ""}`}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp Logo"
                        className="w-12"
                    />
                    <h4 className="text-gray-700 text-lg font-bold">Need more support?</h4>
                    <p className="text-gray-600 text-sm mb-3">Talk to an Accountant</p>
                </div>

                {/* Go Premium Section */}
                <div className={`p-4 text-center  ${!expanded ? "hidden" : ""}`}>
                    <h4 className="text-gray-700 text-lg font-bold">Go Premium!</h4>
                    <p className="text-gray-600 text-xs mb-3">
                        Upgrade your subscription plan to unlock all your business insights!
                    </p>

                    <button className={`bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-400 transition`}>
                        Upgrade Plan
                    </button>
                </div>

                <p className={`text-gray-600 text-sm text-center py-6 ${!expanded ? "hidden" : ""}`}>www.example.com</p>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, active, expanded, path }) {
    return (
        <Link
            className={`
                relative flex items-center py-2 px-3 my-1 w-full
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${active ? "bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-800" : "hover:text-indigo-600 text-gray-600"}
            `}
            to={path}
        >
            <span className={`${expanded ? "text-lg" : "text-2xl"} transition-all`}>
                {icon}
            </span>
            <span className={`overflow-hidden transition-all ${expanded ? "ml-3 w-auto" : "w-0"}`}>
                {text}
            </span>
        </Link>
    );
}

