import axios from 'axios';
import { createContext } from 'react'
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";


export const NavbarContext = createContext()

export const NavbarContextProvider = ({ children }) => {

    //! Navbar
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

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

    return (
        <NavbarContext.Provider value={{ userName, userEmail }}>
            {children}
        </NavbarContext.Provider>
    )
}

