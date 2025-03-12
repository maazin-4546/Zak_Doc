import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const InvoiceExtractor = () => {

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

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
                toast.success("Data extracted successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            } else {
                setError("Failed to extract data");
                toast.error("Failed to extract data", { position: "top-right" });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Something went wrong";
            setError(errorMessage);
            toast.error("Something went wrong", { position: "top-right" });
        }

        setLoading(false);
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
        </div>
    );
};

export default InvoiceExtractor;

