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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden animate-slideFadeIn">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-600">Update Invoice Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-200 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[75vh] overflow-y-auto px-6 py-4 space-y-6 scroll-smooth">
                    <form className="space-y-6">
                        {/* Invoice and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Invoice Number</label>
                                <input
                                    type="text"
                                    value={jsonData?.invoice_number || ""}
                                    onChange={(e) => setJsonData({ ...jsonData, invoice_number: e.target.value })}
                                    className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Date</label>
                                <input
                                    type="text"
                                    value={jsonData?.date || ""}
                                    onChange={(e) => setJsonData({ ...jsonData, date: e.target.value })}
                                    className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Company and Vendor Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Company Name</label>
                                <input
                                    type="text"
                                    value={jsonData?.company_name || ""}
                                    onChange={(e) => setJsonData({ ...jsonData, company_name: e.target.value })}
                                    className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Vendor Name</label>
                                <input
                                    type="text"
                                    value={jsonData?.vendor_name || ""}
                                    onChange={(e) => setJsonData({ ...jsonData, vendor_name: e.target.value })}
                                    className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Category</label>
                            <input
                                type="text"
                                value={jsonData?.category || ""}
                                onChange={(e) => setJsonData({ ...jsonData, category: e.target.value })}
                                className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Products Section */}
                        <div className="space-y-4">
                            {jsonData?.products?.map((product, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Product Name</label>
                                        <input
                                            type="text"
                                            value={product.product_name || ""}
                                            onChange={(e) => {
                                                const updatedProducts = [...jsonData.products];
                                                updatedProducts[index].product_name = e.target.value;
                                                setJsonData({ ...jsonData, products: updatedProducts });
                                            }}
                                            className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Quantity</label>
                                        <input
                                            type="text"
                                            value={product.quantity || ""}
                                            onChange={(e) => {
                                                const updatedProducts = [...jsonData.products];
                                                updatedProducts[index].quantity = e.target.value;
                                                setJsonData({ ...jsonData, products: updatedProducts });
                                            }}
                                            className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">Unit Amount</label>
                                        <input
                                            type="text"
                                            value={product.unit_amount || ""}
                                            onChange={(e) => {
                                                const updatedProducts = [...jsonData.products];
                                                updatedProducts[index].unit_amount = e.target.value;
                                                setJsonData({ ...jsonData, products: updatedProducts });
                                            }}
                                            className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tax and Total */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Tax Amount</label>
                                <input
                                    type="text"
                                    value={jsonData?.tax_amount || ""}
                                    onChange={(e) => setJsonData({ ...jsonData, tax_amount: e.target.value })}
                                    className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Total</label>
                                <input
                                    type="text"
                                    value={jsonData?.total || ""}
                                    onChange={(e) => setJsonData({ ...jsonData, total: e.target.value })}
                                    className="w-full py-2 px-4 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={handleSubmit}
                        className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                    >
                        Update Invoice
                    </button>
                </div>
            </div>
        </div>


    );
};

export default UpdateInvoiceModal;