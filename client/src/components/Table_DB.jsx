import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx"

const Table_DB = () => {

    const tableRef = useRef(null);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    // const [searchQuery, setSearchQuery] = useState("");
    const [invoices, setInvoices] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    // backend Api Call 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/invoices");
                setInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoice data:", error);
            }
        };
        fetchData();
    }, []);


    // seach query
    const filteredRows = invoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const searchedRows = filteredRows.filter((invoice) => {
        const vendorName = invoice.vendor_name?.toLowerCase() || ""; // Convert null to empty string
        return vendorName.includes(searchInput.toLowerCase());
    });

    // Ensure we respect the filter limit (including null values)
    const displayedRows = searchedRows.slice(0, rowsPerPage);

    // Handle export logic
    const handleExport = (e) => {
        const exportFormat = e.target.value;
        if (exportFormat === "Excel") exportToExcel();
        else if (exportFormat === "PDF") exportToPDF(tableRef);
        else if (exportFormat === "Word") exportToWord();
    };

    const exportToPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'A4',
        });

        doc.setFontSize(18);
        doc.text('Patients List', 40, 40);


        doc.autoTable({
            html: tableRef.current,
            startY: 60,
            theme: 'striped',
            headStyles: { fillColor: [33, 150, 243] },
            styles: {
                cellPadding: 8,
                fontSize: 10,
                halign: 'center',
                valign: 'middle',
            },
        });

        doc.save('Invoice_Details.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.table_to_sheet(tableRef.current);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patients List");
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

    // Pagination calculations
    const totalPages = Math.ceil(invoices.length / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage;
    // const currentRows = invoices.slice(startRow, startRow + rowsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    // Handle rowsPerPage selection change
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when rows per page changes
    };


    return (
        <div className='p-2 md:p-6'>
            <div className="flex justify-center items-center p-2 md:p-0">
                <div className="bg-white w-full relative overflow-x-auto shadow-md py-4 p-2 md:p-6 mt-6 md:mt-8">

                    {/* Download Options */}
                    <div className='flex flex-col md:flex-row items-center justify-center md:justify-between py-4 md:py-0 mb-2'>
                        <h1 className="text-3xl text-cyan-700 mb-4">Invoice Data</h1>
                        <div className='flex gap-2 items-center'>
                            <h1 className='text-gray-500'>Export:</h1>
                            <select
                                onChange={handleExport}
                                className="cursor-pointer block w-24 p-1 py-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select</option>
                                <option value="PDF">PDF</option>
                                <option value="Excel">Excel</option>
                                <option value="Word">Word</option>
                            </select>
                        </div>
                    </div>

                    <hr />

                    {/* Rows per page and Search box */}
                    <div className='my-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-0'>
                        <div className="flex gap-2 items-center">
                            <h1 className="text-gray-500">Show</h1>
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="cursor-pointer mt-1 p-2 block w-14 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <h1 className="text-gray-500">entries</h1>
                        </div>

                        <div className="flex gap-2 items-center mb-4">
                            <label className="font-bold block text-sm text-gray-500">Search:</label>
                            <input
                                type="search"
                                placeholder="Search By Vendor Name"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="cursor-pointer mt-1 p-2 block w-full border border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto p-4">
                        <div className="rounded-lg shadow-lg border border-gray-300 overflow-hidden">
                            <table ref={tableRef} className="w-full text-sm text-left text-gray-800 bg-white">
                                <thead className="text-xs font-bold uppercase bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg">
                                    <tr>
                                        {[
                                            "Invoice",
                                            "Date",
                                            "Company Name",
                                            "Vendor Name",
                                            "Products",
                                            "Quantity",
                                            "Unit Amount",
                                            "Tax Amount",
                                            "Total",
                                        ].map((heading, index) => (
                                            <th key={index} className="px-6 py-4 border border-gray-300 text-center">
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedRows.length > 0 ? (
                                        displayedRows.map((invoice, index) => (
                                            <tr
                                                key={index}
                                                className="even:bg-gray-100 odd:bg-gray-50 hover:bg-blue-100 hover:scale-101 transition-all duration-300"
                                            >
                                                <td className="px-6 py-4 border border-gray-300 text-center">{invoice.invoice_number || "null"}</td>
                                                <td className="px-6 py-4 border border-gray-300 text-center">{invoice.date || "null"}</td>
                                                <td className="px-6 py-4 border border-gray-300 text-center">{invoice.company_name || "null"}</td>
                                                <td className="px-6 py-4 border border-gray-300 text-center">{invoice.vendor_name || "null"}</td>
                                                <td className="px-6 py-4 border border-gray-300 text-center">
                                                    {invoice.products?.length ? (
                                                        <ul className="list-disc pl-4 text-sm text-gray-700">
                                                            {invoice.products.map((product, idx) => (
                                                                <li key={idx}>{product.product_name || "null"}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "null"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 border border-gray-300 text-center">
                                                    {invoice.products?.length
                                                        ? invoice.products.map((p, idx) => <div key={idx}>{p.quantity || 0}</div>)
                                                        : "null"}
                                                </td>
                                                <td className="px-6 py-4 border border-gray-300 text-center text-green-600 font-medium">
                                                    {invoice.products?.length
                                                        ? invoice.products.map((p, idx) => <div key={idx}>₹{p.unit_amount || 0}</div>)
                                                        : "null"}
                                                </td>
                                                <td className="px-6 py-4 border border-gray-300 text-center text-yellow-600 font-medium">
                                                    ₹{invoice.tax_amount || 0}
                                                </td>
                                                <td className="px-6 py-4 border border-gray-300 text-center text-indigo-700 font-medium">
                                                    ₹{invoice.total || 0}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="py-4 px-4 text-center text-gray-600 bg-gray-100 border border-gray-300">
                                                No invoices found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-0 my-4">
                        <p className="text-gray-500">Showing {startRow + 1} to {Math.min(startRow + rowsPerPage, invoices.length)} of {invoices.length} entries</p>
                        <nav>
                            <ul className="inline-flex text-sm border border-gray-300">
                                <li>
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 h-8 cursor-pointer ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "text-gray-500"}`}>Previous</button>
                                </li>
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <li key={index}>
                                        <button onClick={() => handlePageChange(index + 1)} className={`px-3 h-8  cursor-pointer ${currentPage === index + 1 ? "bg-cyan-700 text-white" : "text-gray-500"}`}>{index + 1}</button>
                                    </li>
                                ))}
                                <li>
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 h-8 cursor-pointer ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "text-cyan-700"}`}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default Table_DB;
