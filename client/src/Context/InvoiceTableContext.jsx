import { useEffect, useState, useRef, createContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx"
import amiriFontBase64 from "../../fonts/AmiriBase64";
import "../App.css"

import { toast } from "react-toastify";

import dayjs from "dayjs";


export const InvoiceTableContext = createContext()

export const InvoiceTableContextProvider = ({ children }) => {

    const [invoices, setInvoices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [jsonData, setJsonData] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");


    //* API to get user specific data
    const fetchData = async (category = 'All') => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("No token found in localStorage");
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        fetchData(category);
    };

    // * Date Filter
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
    const filteredRows = invoices?.length ? invoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];


    const searchedRows = filteredRows.filter((invoice) => {
        const vendorName = invoice.vendor_name?.toLowerCase() || ""; // Convert null to empty string
        return vendorName.includes(searchInput.toLowerCase());
    });

    const displayedRows = searchedRows.slice(0, rowsPerPage);

    //* Pagination calculations    
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
    const tableRef = useRef(null);

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

    //* delete invoice from table
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
        <InvoiceTableContext.Provider value={{ invoices, isOpen, setIsOpen, jsonData, setJsonData, handleCategoryChange, fetchFilteredInvoicesByDate, displayedRows, totalPages, startRow, handlePageChange, handleRowsPerPageChange, handleExport, tableRef, deleteInvoice, selectedCategory, searchInput, setSearchInput, rowsPerPage, currentPage, startDate, setStartDate, endDate, setEndDate }}>
            {children}
        </InvoiceTableContext.Provider>
    )
}