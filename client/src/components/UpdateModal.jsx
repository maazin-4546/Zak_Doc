import axios from "axios";
import { toast } from "react-toastify";

const UpdateInvoiceModal = ({ jsonData, setJsonData, isOpen, onClose }) => {


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!jsonData || !jsonData._id) {
                toast.error("Invoice._ID is missing");
                return;
            }

            // Prepare data for update
            const { _id, products, ...invoiceFields } = jsonData;

            const updatedData = {
                ...invoiceFields,
                products: Array.isArray(products)
                    ? products.map(({ _id, product_name, quantity, unit_amount }) => ({
                        _id,
                        product_name,
                        quantity,
                        unit_amount,
                    }))
                    : [],
            };

            // console.log("Sending updated data:", updatedData); 

            // Send PUT request with invoice ID
            await axios.put(`http://localhost:5000/api/invoices/${_id}`, updatedData);

            toast.success("Updated Successfully");
            onClose(); // Close modal


        } catch (err) {
            console.error("Error updating invoice:", err);
            toast.error("Failed to update invoice");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="scale-up-center fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative p-6 w-full max-w-[650px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-2xl transition-transform transform">

                {/* Modal Header (Fixed) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="text-3xl font-bold text-cyan-700">Update Information</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-500 hover:text-gray-900 bg-gray-300 rounded-full p-2 transition-colors"
                    >
                        <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body with Scrollable Content */}
                <div className="p-4 max-h-[70vh] overflow-y-auto scroll-smooth">
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Invoice Number</label>
                                <input
                                    type="text"
                                    value={jsonData.invoice_number}
                                    onChange={(e) => setJsonData({ ...jsonData, invoice_number: e.target.value })}
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                                <input
                                    type="text"
                                    value={jsonData.date}
                                    onChange={(e) => setJsonData({ ...jsonData, date: e.target.value })}
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Company Name</label>
                                <input
                                    type="text"
                                    value={jsonData.company_name}
                                    onChange={(e) => setJsonData({ ...jsonData, company_name: e.target.value })}
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Vendor Name</label>
                                <input
                                    type="text"
                                    value={jsonData.vendor_name}
                                    onChange={(e) => setJsonData({ ...jsonData, vendor_name: e.target.value })}
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                            <input
                                type="text"
                                value={jsonData.category}
                                onChange={(e) => setJsonData({ ...jsonData, category: e.target.value })}
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                            />
                        </div>

                        {jsonData.products.map((product, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
                                    <input
                                        type="text"
                                        value={product.product_name}
                                        onChange={(e) => {
                                            const updatedProducts = [...jsonData.products];
                                            updatedProducts[index].product_name = e.target.value;
                                            setJsonData({ ...jsonData, products: updatedProducts });
                                        }}
                                        className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
                                    <input
                                        type="text"
                                        value={product.quantity}
                                        onChange={(e) => {
                                            const updatedProducts = [...jsonData.products];
                                            updatedProducts[index].quantity = e.target.value;
                                            setJsonData({ ...jsonData, products: updatedProducts });
                                        }}
                                        className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Unit Amount</label>
                                    <input
                                        type="text"
                                        value={product.unit_amount}
                                        onChange={(e) => {
                                            const updatedProducts = [...jsonData.products];
                                            updatedProducts[index].unit_amount = e.target.value;
                                            setJsonData({ ...jsonData, products: updatedProducts });
                                        }}
                                        className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Tax Amount</label>
                                <input
                                    type="text"
                                    value={jsonData.tax_amount}
                                    onChange={(e) => setJsonData({ ...jsonData, tax_amount: e.target.value })}
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Total</label>
                                <input
                                    type="text"
                                    value={jsonData.total}
                                    onChange={(e) => setJsonData({ ...jsonData, total: e.target.value })}
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer (Fixed) */}
                <div className="p-4 border-t border-gray-300">
                    <button
                        onClick={handleSubmit}
                        className="cursor-pointer w-full text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-5 py-3 shadow-lg transition-transform transform"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>

    );
};

export default UpdateInvoiceModal;