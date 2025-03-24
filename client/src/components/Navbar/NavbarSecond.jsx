import React from 'react'
import { FaHome } from "react-icons/fa";

const NavbarSecond = ({ title, path }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-between px-4 py-2 shadow-sm">
            <h1 className="text-gray-700 text-sm md:text-2xl font-medium">{title}</h1>
            <div className="flex justify-center items-center space-x-2 bg-indigo-400 rounded-3xl p-2 px-3 shadow-md">
                <FaHome fontSize={20} color="white" />
                <h1 className="text-white text-xs md:text-base">{path}</h1>
            </div>
        </div>
    )
}

export default NavbarSecond