import React, { useContext } from 'react'
import { InvoiceTableContext } from '../../Context/InvoiceTableContext'

const BottomSection = () => {

    const { isOpen, setIsOpen, jsonData, setJsonData, invoices, handleCategoryChange, fetchFilteredInvoicesByDate, displayedRows, totalPages, startRow, handlePageChange, handleRowsPerPageChange, handleExport, tableRef, deleteInvoice, selectedCategory, searchInput, setSearchInput, rowsPerPage, currentPage, startDate, setStartDate, endDate, setEndDate } = useContext(InvoiceTableContext)

    return (
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
    )
}

export default BottomSection