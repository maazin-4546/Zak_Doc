import { useState, useContext } from "react";
import 'jspdf-autotable';
import "../../App.css"
import NavbarSecond from "../Navbar/NavbarSecond";
import { Pencil, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UpdateInvoiceModal from "../Modals/UpdateModal";
import "react-datepicker/dist/react-datepicker.css";
import { InvoiceTableContext } from "../../Context/InvoiceTableContext";
import TopControls from "./TopControls";
import BottomSection from "./BottomSection";

const InvoiceTable = () => {

    const { isOpen, setIsOpen, jsonData, setJsonData,  displayedRows,  tableRef, deleteInvoice} = useContext(InvoiceTableContext)

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <NavbarSecond title={"Invoice Data"} path={" / Invoice / Data"} />
            <ToastContainer />
            <div className='p-2 md:p-6'>
                <div className="flex justify-center items-center p-2 md:p-0">
                    <div className="bg-white relative overflow-x-auto shadow-md py-4 p-2 md:p-6 mt-6 md:mt-8">

                        {/* Top Controls */}
                        <TopControls />


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
                        <BottomSection />

                    </div>
                </div>
            </div>
        </>
    );
};


export default InvoiceTable;