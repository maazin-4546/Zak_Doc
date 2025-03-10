import { useState, useEffect } from 'react';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll event to change navbar style
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-20 transition-all duration-300 ${isScrolled
                ? "bg-white shadow-lg backdrop-blur-md"
                : "bg-gradient-to-r from-cyan-600 to-cyan-700"
                }`}
        >
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a
                    href="#"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <img
                        src="./NavIcon.JPG"
                        className={`h-12 rounded-full ${isScrolled ? "shadow-md shadow-gray-500" : ""}`}
                        alt="Flowbite Logo"
                    />
                    <span
                        className={`self-center text-2xl font-bold tracking-wide ${isScrolled ? "text-gray-800" : "text-white"
                            }`}
                    >
                        ZakDoc
                    </span>
                </a>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden ${isScrolled
                        ? "text-gray-700 hover:bg-gray-200"
                        : "text-white hover:bg-blue-600"
                        } focus:outline-none focus:ring-2 focus:ring-gray-200`}
                    aria-controls="navbar-default"
                    aria-expanded={isOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
                <div
                    className={`${isOpen ? "block" : "hidden"
                        } w-full md:block md:w-auto transition-all duration-300`}
                    id="navbar-default"
                >
                    <ul
                        className={`font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ${isScrolled ? "bg-white" : "bg-transparent"
                            }`}
                    >
                        {["Home", "About", "Services", "Pricing", "Contact"].map(
                            (item, idx) => (
                                <li key={idx}>
                                    <a
                                        href="#"
                                        className={`block py-2 px-4 rounded-md transition-colors duration-200 ${isScrolled
                                            ? "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                            : "text-white hover:text-yellow-300"
                                            } md:hover:bg-transparent md:p-0`}
                                    >
                                        {item}
                                    </a>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
