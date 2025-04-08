import { useEffect, useState, useRef, createContext, useContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx"
import amiriFontBase64 from "../../fonts/AmiriBase64";
import "../App.css"
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { DashboardContext } from "./DashboardContext";


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

    const [isSyncing, setIsSyncing] = useState(false);
    const { totalSpending } = useContext(DashboardContext)


    //* API to get user specific data
    const fetchData = async (category = 'All') => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("No token found in localStorage. Skipping fetchData.");
            setInvoices([]);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            let url = "http://localhost:5000/api/user-invoices";
            if (category !== 'All') {
                url = `http://localhost:5000/api/user-invoices/category/${encodeURIComponent(category)}`;
            }

            const response = await axios.get(url, config);
            setInvoices(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching invoice data:", error.response?.data || error.message);
            setInvoices([]); // Clear invoices on error
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

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([]);

        // Extract headers
        const headers = [
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
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        const tableRows = Array.from(tableRef.current.querySelectorAll("tbody tr")).map((row) => {
            const cells = row.querySelectorAll("td");

            // Extract products, quantity, and unit amount separately
            const products = [];
            const quantities = [];
            const unitAmounts = [];

            // Ensure correct column indexing
            const productListItems = cells[5]?.querySelectorAll("li");
            productListItems?.forEach((li, idx) => {
                products.push(li.textContent.trim());

                quantities.push(cells[7]?.querySelectorAll("div")[idx]?.textContent.trim() || "0");
                unitAmounts.push(cells[8]?.querySelectorAll("div")[idx]?.textContent.trim() || "₹0");
            });

            return [
                cells[0]?.textContent.trim() || "null", // Invoice
                cells[1]?.textContent.trim() || "null", // Invoice Date
                cells[2]?.textContent.trim() || "null", // Upload Date
                cells[3]?.textContent.trim() || "null", // Company Name
                cells[4]?.textContent.trim() || "null", // Vendor Name
                products.join("\n"), // Products
                cells[6]?.textContent.trim() || "null", // Category
                quantities.join("\n"), // Quantity
                unitAmounts.join("\n"), // Unit Amount
                cells[9]?.textContent.trim() || "₹0", // Tax Amount
                cells[10]?.textContent.trim() || "₹0", // Total
            ];
        });


        XLSX.utils.sheet_add_aoa(worksheet, tableRows, { origin: "A2" });

        worksheet["!cols"] = [
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 25 },
            { wch: 25 },
            { wch: 40 },
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


    //* Sync Invoices to Zoho 
    const handleSyncToZoho = async () => {
        setIsSyncing(true);
        try {
            const token = localStorage.getItem("token");
            let allSuccess = true;

            for (const invoice of displayedRows) {
                const payload = {
                    invoice_number: invoice.invoice_number,
                    date: invoice.date,
                    company_name: invoice.company_name,
                    vendor_name: invoice.vendor_name,
                    tax_amount: invoice.tax_amount,
                    total: invoice.total,
                    products: invoice.products?.map((product) => ({
                        product_name: product.product_name,
                        quantity: product.quantity,
                        unit_amount: product.unit_amount,
                    })),
                    category: invoice.category,
                };

                const res = await fetch("http://localhost:5000/zoho/add-invoices", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ payload, totalSpending }),
                });

                const data = await res.json();

                if (!res.ok || data.success === false) {
                    console.error("Sync error:", data.message || "Unknown error");
                    allSuccess = false;
                }
            }

            if (allSuccess) {
                toast.success("All invoices synced successfully!");
            } else {
                toast.error("Some invoices failed to sync.");
            }
        } catch (err) {
            console.error("❌ Request failed:", err);
            toast.error("Sync Failed");
        } finally {
            setIsSyncing(false);
        }
    };


    return (
        <InvoiceTableContext.Provider value={{ invoices, isOpen, setIsOpen, jsonData, setJsonData, handleCategoryChange, fetchFilteredInvoicesByDate, displayedRows, totalPages, startRow, handlePageChange, handleRowsPerPageChange, handleExport, tableRef, deleteInvoice, selectedCategory, searchInput, setSearchInput, rowsPerPage, currentPage, startDate, setStartDate, endDate, setEndDate, handleSyncToZoho, isSyncing }}>
            {children}
        </InvoiceTableContext.Provider>
    )
}