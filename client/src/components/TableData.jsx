import { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { Receipt_Details } from "../../lib/data";


const Table_Data = () => {

    const tableRef = useRef(null);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState(Receipt_Details);

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
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage;
    const currentRows = filteredRows.slice(startRow, startRow + rowsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Handle rowsPerPage selection change
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Filter rows based on search query
    useEffect(() => {
        const lowerCaseQuery = (searchQuery || '').toLowerCase();
        const filteredData = Receipt_Details.filter((row) =>
            (row.vendor?.toLowerCase() || '').includes(lowerCaseQuery)
        );
        setFilteredRows(filteredData);
        setCurrentPage(1);
    }, [searchQuery]);


    return (
        <div>
            <div className='p-2 md:p-6'>
                <div className="flex justify-center items-center p-2 md:p-0">
                    <div className="bg-white w-full relative overflow-x-auto shadow-md py-4 p-2 md:p-6 mt-6 md:mt-8">
                        <div className='flex flex-col md:flex-row items-center justify-center md:justify-between py-4 md:py-0 mb-2'>
                            <h1 className="text-3xl text-[#1A56DB] mb-4">Invoice Data</h1>
                            <div className='flex gap-2 items-center'>
                                <h1 className='text-gray-500'>Export:</h1>
                                <select
                                    onChange={handleExport}
                                    className="block w-24 p-1 py-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select</option>
                                    <option value="PDF">PDF</option>
                                    <option value="Excel">Excel</option>
                                    <option value="Word">Word</option>
                                </select>
                            </div>
                        </div>
                        <hr />

                        <div className='my-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-0'>
                            <div className="flex gap-2 items-center">
                                <h1 className="text-gray-500">Show</h1>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="mt-1 p-2 block w-14 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                                <h1 className="text-gray-500">entries</h1>
                            </div>

                            <div className='flex gap-2 items-center'>
                                <label className="font-bold block text-sm text-gray-500">Search:</label>
                                <input
                                    type="search"
                                    placeholder="Search By Vendor"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="mt-1 p-2 block w-full border border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <table
                            ref={tableRef}
                            className="w-full text-sm text-left text-gray-800 bg-white rounded-lg shadow-lg overflow-hidden border-collapse transform transition-transform duration-300"
                        >
                            <thead className="text-xs font-bold uppercase bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                                <tr>
                                    <th className="px-6 py-4 border-b border-r border-white">Date</th>
                                    <th className="px-6 py-4 border-b border-r border-white">Company Name</th>
                                    <th className="px-6 py-4 border-b border-r border-white">Product Name</th>
                                    <th className="px-6 py-4 border-b border-r border-white">Vendor Name</th>
                                    <th className="px-6 py-4 border-b border-r border-white text-center">Quantity</th>
                                    <th className="px-6 py-4 border-b border-r border-white text-right">Unit Amount</th>
                                    <th className="px-6 py-4 border-b border-r border-white text-right">Tax Amount</th>
                                    <th className="px-6 py-4 border-b border-r border-white text-right">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRows.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`transition-all duration-300 ease-in-out ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-indigo-50 hover:shadow-md transform transition-transform duration-300 hover:scale-101`}
                                    >
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300">{item.date}</td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300">{item.companyName}</td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300">{item.productName}</td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300">{item.vendor}</td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300 text-center">{item.quantity}</td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300 text-right text-green-600 font-medium">
                                            ₹{item.productAmount}
                                        </td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300 text-right text-yellow-600 font-medium">
                                            ₹{item.taxAmount}
                                        </td>
                                        <td className="px-6 py-4 border-b border-r border-gray-200 transition-colors duration-300 text-right text-indigo-700 font-semibold">
                                            ₹{item.total}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-0 my-4">
                            <p className="text-gray-500">
                                Showing {startRow + 1} to {Math.min(startRow + rowsPerPage, filteredRows.length)} of {filteredRows.length} entries
                            </p>

                            <nav aria-label="Page navigation example">
                                <ul className="inline-flex text-sm border border-gray-300">
                                    <li>
                                        <button onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer border border-gray-300 px-3 h-8 text-gray-500">
                                            Previous
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`cursor-pointer px-3 h-8 ${currentPage === index + 1 ? "border border-gray-300 text-white bg-[#1A56DB]" : "text-gray-500"}`}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <button onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer px-3 h-8 text-[#1A56DB]">
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table_Data;
