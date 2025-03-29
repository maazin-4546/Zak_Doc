import { createContext } from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


export const NavbarContext = createContext()

export const NavbarContextProvider = ({ children }) => {

    const navigate = useNavigate()

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const token = localStorage.getItem("token");

    // Extracting name and email to display on navbar
    useEffect(() => {
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

    // Logout Function
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/user/logout", {
                method: "POST",
                credentials: "include",
            });

            localStorage.removeItem("token");
            setIsLoggedIn(false);
            toast.success("Logged out successfully");

            navigate("/login");              
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Logout failed", error);
        }
    };

    return (
        <NavbarContext.Provider value={{ userName, userEmail, setIsLoggedIn, handleLogout }}>
            {children}
        </NavbarContext.Provider>
    )
}

