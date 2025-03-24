import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, User, CreditCard, Plug, Phone, Globe, Lock, LogOut, ChevronRight } from "lucide-react";
import NavbarSecond from "./Navbar/NavbarSecond";

const settingsOptions = [
    {
        icon: <User className="w-6 h-6 text-blue-600" />,
        title: "Profile",
        description: "Update your personal information and profile picture.",
        path: '/user-profile'
    },
    {
        icon: <CreditCard className="w-6 h-6 text-green-600" />,
        title: "Billing",
        description: "Manage your subscriptions and payment methods.",
        path: '/'
    },
    {
        icon: <Plug className="w-6 h-6 text-purple-600" />,
        title: "Integration",
        description: "Connect with third-party apps and services.",
        path: '/'
    },
    {
        icon: <Phone className="w-6 h-6 text-orange-600" />,
        title: "Contact Us",
        description: "Get support or send us your feedback.",
        path: '/'
    },
    {
        icon: <Globe className="w-6 h-6 text-yellow-600" />,
        title: "Change Language",
        description: "Select your preferred language for the application.",
        path: '/'
    },
    {
        icon: <Lock className="w-6 h-6 text-red-600" />,
        title: "Change Password",
        description: "Update your account password securely.",
        path: '/change-password'
    },
    {
        icon: <LogOut className="w-6 h-6 text-gray-600" />,
        title: "Logout",
        description: "Sign out from your account.",
        path: '/',
    }
];

export default function SettingsPage() {

    return (
        <>
            <NavbarSecond title={"Settings"} path={" / Settings"} />            
            <div className="min-h-screen overflow-y-auto">
                <div className="p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {settingsOptions.map((option, index) => (
                            <Link
                                key={index}
                                to={option.path}
                                className="bg-white w-full p-6 rounded-2xl shadow hover:shadow-md transition border border-gray-200 flex items-center justify-between cursor-pointer"
                            >
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        {option.icon}
                                        <h2 className="text-lg font-semibold">{option.title}</h2>
                                    </div>
                                    <p className="text-gray-600 text-sm">{option.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
