import React, { useContext } from 'react'
import { InvoiceTableContext } from '../../Context/InvoiceTableContext'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'
import { Search } from "lucide-react";

const TopControls = () => {

    const { handleCategoryChange, fetchFilteredInvoicesByDate, handleExport, selectedCategory, searchInput, setSearchInput, startDate, setStartDate, endDate, setEndDate } = useContext(InvoiceTableContext)

    return (
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    <button
                        onClick={fetchFilteredInvoicesByDate}
                        className="px-4 py-2 cursor-pointer bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none flex items-center justify-center"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Export Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-1/6">
                <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Export:</label>
                <select
                    onChange={handleExport}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">Select</option>
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="Word">Word</option>
                </select>
            </div>
        </div>
    )
}

export default TopControls