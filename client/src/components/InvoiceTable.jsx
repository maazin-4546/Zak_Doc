import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx"
import amiriFontBase64 from "../../fonts/AmiriBase64";
import "../App.css"
import NavbarSecond from "./Navbar/NavbarSecond";
import { Pencil, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UpdateInvoiceModal from "./Modals/UpdateModal";
import { GenerateContext } from "../Context/ContextAPI";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const InvoiceTable = () => {

    const { isOpen, setIsOpen, jsonData, setJsonData } = useContext(GenerateContext)

    const tableRef = useRef(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoices, setInvoices] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [openModal, setOpenModal] = useState(false);

    // top controls
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");



    //* backend Api Call 
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (category = 'All') => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Use the correct endpoint structure based on your routes
            let url = "http://localhost:5000/api/user-invoices";
            if (category !== 'All') {
                url = `http://localhost:5000/api/user-invoices/category/${encodeURIComponent(category)}`;
            }

            const response = await axios.get(url, config);

            setInvoices(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching invoice data:", error.response?.data || error.message);
            setInvoices([]);
        }
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        fetchData(category);
    };

    const fetchFilteredInvoicesByDate = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both the dates");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:5000/api/invoices/filter/by-date", {
                params: {
                    startDate: dayjs(startDate).format("YYYY-MM-DD"),
                    endDate: dayjs(endDate).format("YYYY-MM-DD"),
                },
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });

            setInvoices(response.data.data);
        } catch (err) {
            console.error("Error fetching invoices:", err.response?.data || err.message);
        }
    };

    //* seach query
    // const filteredRows = invoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const filteredRows = invoices?.length ? invoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];


    const searchedRows = filteredRows.filter((invoice) => {
        const vendorName = invoice.vendor_name?.toLowerCase() || ""; // Convert null to empty string
        return vendorName.includes(searchInput.toLowerCase());
    });

    const displayedRows = searchedRows.slice(0, rowsPerPage);

    //* Pagination calculations
    // const totalPages = Math.ceil(invoices.length / rowsPerPage);
    const totalPages = invoices ? Math.ceil(invoices.length / rowsPerPage) : 1;

    const startRow = (currentPage - 1) * rowsPerPage;

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    //* Handle rowsPerPage selection change
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    //* Handle export logic
    const handleExport = (e) => {
        const exportFormat = e.target.value;

        if (exportFormat === "Excel") {
            exportToExcel();
        } else if (exportFormat === "PDF") {
            if (tableRef?.current) {
                exportToPDF(tableRef.current);
            } else {
                console.error("Table reference is not available");
            }
        } else if (exportFormat === "Word") {
            exportToWord();
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "A4",
        });

        // Register the Amiri font
        doc.addFileToVFS("Amiri-Regular.ttf", amiriFontBase64);
        doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
        doc.setFont("Amiri");

        const table = document.getElementById("table_data");

        const headers = [];
        const data = [];

        // Extract headers
        table.querySelectorAll("thead tr th").forEach((th) => {
            headers.push(th.innerText);
        });

        // Extract rows
        table.querySelectorAll("tbody tr").forEach((tr) => {
            const rowData = [];
            tr.querySelectorAll("td").forEach((td, index) => {
                let text = td.innerText.trim();

                if ([6, 7, 8].includes(index)) {
                    text = text.replace(/₹/g, "₹ ");
                }

                rowData.push(text);
            });
            data.push(rowData);
        });

        doc.autoTable({
            head: [headers],
            body: data,
            startY: 60,
            theme: "striped",
            styles: {
                font: "Amiri", // Apply Arabic font
                cellPadding: 4,
                fontSize: 8,
                halign: "left",
                valign: "middle",
            },
            columnStyles: {
                6: { halign: "left" },
                7: { halign: "left" },
                8: { halign: "left" },
            },
        });

        doc.save("Invoice_Details.pdf");
    };

    const exportToExcel = () => {
        if (!tableRef.current) return;

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([]);

        // Extract headers
        const headers = [
            "Invoice",
            "Date",
            "Company Name",
            "Vendor Name",
            "Products",
            "Category",
            "Quantity",
            "Unit Amount",
            "Tax Amount",
            "Total",
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        // Extract table data
        const tableRows = Array.from(tableRef.current.querySelectorAll("tbody tr")).map((row) => {
            const cells = row.querySelectorAll("td");

            // Extract products, quantity, and unit amount separately
            const products = [];
            const quantities = [];
            const unitAmounts = [];

            // Get product details from the Products column
            const productListItems = cells[4]?.querySelectorAll("li");
            productListItems?.forEach((li, idx) => {
                products.push(li.textContent.trim());
                quantities.push(cells[5]?.querySelectorAll("div")[idx]?.textContent.trim() || "0");
                unitAmounts.push(cells[6]?.querySelectorAll("div")[idx]?.textContent.trim() || "₹0");
            });

            return [
                cells[0]?.textContent.trim() || "null",
                cells[1]?.textContent.trim() || "null",
                cells[2]?.textContent.trim() || "null",
                cells[3]?.textContent.trim() || "null",
                products.join("\n"),
                cells[5]?.textContent.trim() || "null",
                quantities.join("\n"),
                unitAmounts.join("\n"),
                cells[8]?.textContent.trim() || "₹0",
                cells[9]?.textContent.trim() || "₹0",
            ];
        });

        // Add data to worksheet
        XLSX.utils.sheet_add_aoa(worksheet, tableRows, { origin: "A2" });

        // Adjust column widths for readability
        worksheet["!cols"] = [
            { wch: 15 },
            { wch: 15 },
            { wch: 25 },
            { wch: 25 },
            { wch: 40 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice_Details");

        XLSX.writeFile(workbook, "Invoice_Details.xlsx");
    };

    const exportToWord = () => {
        const tableHTML = tableRef.current.outerHTML;
        const blob = new Blob(['\ufeff', tableHTML], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Invoice_Details.doc";
        link.click();
    };

    const deleteInvoice = async (invoiceId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("User not authenticated");
            return { success: false, error: "Unauthorized: No token provided" };
        }

        try {
            const response = await fetch(`http://localhost:5000/api/delete-invoice/${invoiceId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete invoice");
            }

            toast.success("Invoice Deleted Successfully");
            return { success: true, message: data.message };
        } catch (error) {
            toast.error(`Delete invoice error: ${error.message}`);
            return { success: false, error: error.message };
        }
    };

    return (
        <>
            <NavbarSecond title={"Invoice Data"} path={" / Invoice / Data"} />
            <ToastContainer />
            <div className='p-2 md:p-6'>
                <div className="flex justify-center items-center p-2 md:p-0">
                    <div className="bg-white relative overflow-x-auto shadow-md py-4 p-2 md:p-6 mt-6 md:mt-8">

                        {/* Top Controls */}
                        <div className="my-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2 w-full">
                            {/* Search Bar */}
                            <div className="flex items-center gap-2 w-full md:w-1/4">
                                <label className="text-sm text-gray-600 font-medium">Search:</label>
                                <input
                                    type="search"
                                    placeholder="By Vendor Name"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="flex items-center gap-2 w-full md:w-1/4">
                                <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter By:</label>
                                <select
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="All">All</option>
                                    <option value="Office & Business Expenses">Office & Business Expenses</option>
                                    <option value="Travel & Transportation">Travel & Transportation</option>
                                    <option value="Food & Beverages">Food & Beverages</option>
                                    <option value="Shopping & Retail">Shopping & Retail</option>
                                    <option value="Medical & Healthcare">Medical & Healthcare</option>
                                    <option value="Housing & Rent">Housing & Rent</option>
                                </select>
                            </div>

                            {/* Date Range Picker */}
                            <div className="flex items-center gap-2 w-full md:w-1/3">
                                <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Date Range:</label>
                                <div className="flex items-center justify-center w-full space-x-2">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(dayjs(date).toDate())}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        placeholderText="Start Date"
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                    />

                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(dayjs(date).toDate())}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        placeholderText="End Date"
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                    />

                                    <button
                                        onClick={fetchFilteredInvoicesByDate}
                                        className="px-4 py-1.5 cursor-pointer bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>

                            {/* Export Dropdown */}
                            <div className="flex items-center gap-2 w-full md:w-1/6">
                                <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Export:</label>
                                <select
                                    onChange={handleExport}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <option value="">Select</option>
                                    <option value="PDF">PDF</option>
                                    <option value="Excel">Excel</option>
                                    <option value="Word">Word</option>
                                </select>
                            </div>
                        </div>


                        {/* Table */}
                        <div className="p-4">
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                                    <table
                                        id="table_data"
                                        ref={tableRef}
                                        className="min-w-full text-sm text-gray-800"
                                    >
                                        {/* Table Head */}
                                        <thead className="shadow-sm text-black text-sm">
                                            <tr>
                                                {[
                                                    "Invoice",
                                                    "Invoice Date",
                                                    "Upload Date",
                                                    "Company Name",
                                                    "Vendor Name",
                                                    "Products",
                                                    "Category",
                                                    "Quantity",
                                                    "Unit Amount",
                                                    "Tax Amount",
                                                    "Total",
                                                    "Actions",
                                                ].map((heading, index) => (
                                                    <th
                                                        key={index}
                                                        className="px-5 py-4 text-center font-medium tracking-wide border-b border-gray-200"
                                                    >
                                                        {heading}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        {/* Table Body */}
                                        <tbody>
                                            {displayedRows.length > 0 ? (
                                                displayedRows.map((invoice, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-indigo-50 transition-colors duration-200 border-b border-gray-300"
                                                    >
                                                        <td className="px-5 py-4 text-center">{invoice.invoice_number || "—"}</td>
                                                        <td className="px-5 py-4 text-center">
                                                            {invoice.date
                                                                ? new Date(invoice.date).toLocaleDateString("en-GB")
                                                                : "—"}
                                                        </td>
                                                        <td className="px-5 py-4 text-center">
                                                            {invoice.createdAt
                                                                ? new Date(invoice.createdAt).toLocaleDateString("en-GB") // Formats to DD/MM/YYYY
                                                                : "—"}
                                                        </td>
                                                        <td className="px-5 py-4">{invoice.company_name || "—"}</td>
                                                        <td className="px-5 py-4">{invoice.vendor_name || "—"}</td>
                                                        <td className="px-5 py-4">
                                                            {invoice.products?.length ? (
                                                                <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                                                                    {invoice.products.map((product, idx) => (
                                                                        <li key={idx}>{product.product_name || "—"}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                "—"
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">{invoice.category || "—"}</td>
                                                        <td className="px-5 py-4 text-center">
                                                            {invoice.products?.length
                                                                ? invoice.products.map((p, idx) => (
                                                                    <div key={idx}>{p.quantity || 0}</div>
                                                                ))
                                                                : "—"}
                                                        </td>
                                                        <td className="px-5 py-4 text-indigo-600 font-semibold">
                                                            {invoice.products?.length
                                                                ? invoice.products.map((p, idx) => (
                                                                    <div key={idx}>{p.unit_amount || 0}</div>
                                                                ))
                                                                : "—"}
                                                        </td>
                                                        <td className="px-5 py-4 text-center text-yellow-600 font-medium">
                                                            {invoice.tax_amount || 0}
                                                        </td>
                                                        <td className="px-5 py-4 text-center text-indigo-700 font-bold">
                                                            {invoice.total || 0}
                                                        </td>

                                                        {/* ACTION ICONS */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex justify-center items-center gap-3">
                                                                <button
                                                                    onClick={() => {
                                                                        setJsonData(invoice);
                                                                        setIsOpen(true);
                                                                    }}
                                                                    className="cursor-pointer p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 hover:text-indigo-800 transition-transform hover:scale-110"
                                                                    title="Update"
                                                                >
                                                                    <Pencil size={18} />
                                                                </button>

                                                                <button
                                                                    onClick={() => setOpenModal(true)}
                                                                    className="cursor-pointer p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>

                                                                {/* Confirmation Modal */}
                                                                <DeleteConfirmationModal
                                                                    openModal={openModal}
                                                                    setOpenModal={setOpenModal}
                                                                    invoice={invoice}
                                                                    deleteInvoice={deleteInvoice}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="11"
                                                        className="px-6 py-6 text-center text-gray-500 bg-gray-50 border-t border-gray-200"
                                                    >
                                                        No invoices found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <UpdateInvoiceModal
                            jsonData={jsonData}
                            setJsonData={setJsonData}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                        />

                        {/* Bottom Section */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2 my-6">

                            {/* Rows per Page */}
                            <div className="flex items-center gap-2 w-full md:w-1/6">
                                <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Show</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className="text-sm text-gray-600">entries</span>
                            </div>

                            {/* Pagination Info */}
                            <p className="text-md text-gray-500">
                                {/* Showing {startRow + 1} to {Math.min(startRow + rowsPerPage, invoices.length)} of {invoices.length} entries */}
                                Showing {startRow + 1} to {Math.min(startRow + rowsPerPage, invoices?.length || 0)} of {invoices?.length || 0} entries

                            </p>

                            {/* Pagination Buttons */}
                            <nav>
                                <ul className="inline-flex flex-wrap items-center border border-gray-300 rounded-md overflow-hidden text-sm">
                                    <li>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1.5 ${currentPage === 1
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {totalPages > 7 ? (
                                        <>
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    className={`px-3 py-1.5 ${currentPage === 1 ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    1
                                                </button>
                                            </li>

                                            {currentPage > 4 && <li className="px-2 text-gray-500">...</li>}

                                            {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                                                .filter(page => page > 1 && page < totalPages)
                                                .map(page => (
                                                    <li key={page}>
                                                        <button
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-3 py-1.5 ${currentPage === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    </li>
                                                ))}

                                            {currentPage < totalPages - 3 && <li className="px-2 text-gray-500">...</li>}

                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className={`px-3 py-1.5 ${currentPage === totalPages ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {totalPages}
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        Array.from({ length: totalPages }).map((_, index) => (
                                            <li key={index}>
                                                <button
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`px-3 py-1.5 ${currentPage === index + 1 ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))
                                    )}

                                    <li>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1.5 ${currentPage === totalPages
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};


export default InvoiceTable;