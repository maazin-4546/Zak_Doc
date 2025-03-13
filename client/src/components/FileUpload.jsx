import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "../App.css"

const InvoiceExtractor = () => {

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    // * Modal code
    const [isOpen, setIsOpen] = useState(false);
    const [uploadCompleted, setUploadCompleted] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        invoice_number: "",
        date: "",
        company_name: "",
        vendor_name: "",
        category: "",
        tax_amount: "",
        total: "",
        products: []
    });


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setSelectedFile(file);
            if (file.type.startsWith("image/")) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image or PDF file first!");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/extract", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setJsonData(response.data.data);
                toast.success("Data extracted successfully!", { position: "top-right", autoClose: 3000 });

                setIsOpen(true);
                setUploadCompleted(true);
            } else {
                setError("Failed to extract data");
                toast.error("Failed to extract data", { position: "top-right" });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Something went wrong";
            setError(errorMessage);
            toast.error(errorMessage, { position: "top-right" });
        }

        setLoading(false);
    }

    useEffect(() => {
        if (uploadCompleted) {
            const fetchLatestInvoice = async () => {
                try {
                    const response = await axios.get("http://localhost:5000/api/invoices/latest");
                    setInvoiceData(response.data.data);
                } catch (err) {
                    setError("Failed to fetch invoice");
                } finally {
                    setLoading(false);
                }
            };

            fetchLatestInvoice();
            setUploadCompleted(false); // Reset after fetching
        }
    }, [uploadCompleted]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedData = {};

            // Add invoice-level updates if changed
            ["invoice_number", "date", "company_name", "vendor_name", "tax_amount", "total", "category"].forEach((key) => {
                if (invoiceData[key] !== undefined && invoiceData[key] !== "") {
                    updatedData[key] = invoiceData[key];
                }
            });

            // Add product-level updates if changed
            const updatedProducts = invoiceData.products
                .filter(product => product._id)  // Ensure products have an ID
                .map(product => {
                    const updatedProduct = {};
                    Object.keys(product).forEach((key) => {
                        if (product[key] !== undefined && product[key] !== "") {
                            updatedProduct[key] = product[key];
                        }
                    });
                    return updatedProduct;
                });

            if (updatedProducts.length > 0) {
                updatedData.products = updatedProducts;
            }

            // Send API request
            await axios.put("http://localhost:5000/api/invoices/latest/product", updatedData);
            setIsOpen(false)
            toast.success("Updated Successfully")

        } catch (err) {
            console.error("Error updating invoice:", err);
            toast.error("Failed to update invoice");
        }
    };


    return (
        <div className="mt-14 flex flex-col items-center justify-center min-h-screen p-6">
            <ToastContainer />
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center border border-gray-200">
                <h2 className="text-3xl font-extrabold text-cyan-700 mb-6 tracking-wide">Invoice Data Extraction</h2>

                {/* File Input */}
                <label className="block w-full cursor-pointer">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="w-full h-16 px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 shadow-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center justify-center text-lg font-medium transition-all duration-300">
                        📂 Upload Invoice (Image/PDF)
                    </div>
                </label>

                {/* File Details */}
                {selectedFile && (
                    <div className="mt-6 p-5 bg-gray-100 rounded-xl w-full border border-gray-300 shadow-sm">
                        <p className="text-gray-700 font-medium">
                            File Name: <span className="font-semibold text-blue-600">{selectedFile.name}</span>
                        </p>
                        <p className="text-gray-700 font-medium">
                            Size: <span className="font-semibold text-blue-600">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                        </p>

                        {/* Image Preview */}
                        {preview && (
                            <div className="mt-4">
                                <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-xl border border-gray-300 shadow-md mx-auto" />
                            </div>
                        )}
                    </div>
                )}

                {/* Extract Button */}
                <button
                    onClick={handleUpload}
                    className={`w-full mt-6 py-3 px-6 text-lg font-semibold cursor-pointer text-white rounded-xl transition-all duration-300 
            ${loading ? 'bg-cyan-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 shadow-lg hover:shadow-xl'}`}
                    disabled={loading}
                >
                    {loading ? '🔄 Extracting...' : '🚀 Extract Data'}
                </button>

                {/* Error Message */}
                {error && <p className="mt-4 text-red-500 text-lg font-medium">{error}</p>}

                {/* Extracted JSON Data */}
                {jsonData && (
                    <pre className="mt-6 bg-gray-100 text-gray-700 p-5 rounded-xl text-left w-full max-h-96 overflow-auto border border-gray-300 shadow-md">
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>
                )}
            </div>


            {/* Modal */}
            {isOpen && (
                <div className={`scale-up-center fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300`}>
                    <div className="overflow-y-auto relative p-6 w-full max-w-[650px] bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl transition-transform transform">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Update Information</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-gray-700 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="p-4">
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Number</label>
                                        <input
                                            type="text"
                                            value={invoiceData.invoice_number}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, invoice_number: e.target.value })}
                                            className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                        <input
                                            type="text"
                                            value={invoiceData.date}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                                            className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                                        <input
                                            type="text"
                                            value={invoiceData.company_name}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, company_name: e.target.value })}
                                            className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vendor Name</label>
                                        <input
                                            type="text"
                                            value={invoiceData.vendor_name}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, vendor_name: e.target.value })}
                                            className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                    <input
                                        type="text"
                                        value={invoiceData.category}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, category: e.target.value })}
                                        className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                    />
                                </div>

                                {invoiceData.products.map((product, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                                            <input
                                                type="text"
                                                value={product.product_name}
                                                onChange={(e) => {
                                                    const updatedProducts = [...invoiceData.products];
                                                    updatedProducts[index].product_name = e.target.value;
                                                    setInvoiceData({ ...invoiceData, products: updatedProducts });
                                                }}
                                                className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                                            <input
                                                type="text"
                                                value={product.quantity}
                                                onChange={(e) => {
                                                    const updatedProducts = [...invoiceData.products];
                                                    updatedProducts[index].quantity = e.target.value;
                                                    setInvoiceData({ ...invoiceData, products: updatedProducts });
                                                }}
                                                className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit Amount</label>
                                            <input
                                                type="text"
                                                value={product.unit_amount}
                                                onChange={(e) => {
                                                    const updatedProducts = [...invoiceData.products];
                                                    updatedProducts[index].unit_amount = e.target.value;
                                                    setInvoiceData({ ...invoiceData, products: updatedProducts });
                                                }}
                                                className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tax Amount</label>
                                        <input
                                            type="text"
                                            value={invoiceData.tax_amount}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, tax_amount: e.target.value })}
                                            className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                                        <input
                                            type="text"
                                            value={invoiceData.total}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, total: e.target.value })}
                                            className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-5 py-3 shadow-lg transition-transform transform hover:scale-105"
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            )}

        </div>
    );
};

export default InvoiceExtractor;

