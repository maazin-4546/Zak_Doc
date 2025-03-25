import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UpdateInvoiceModal from "./Modals/UpdateModal";
import { CloudUpload, Loader2, FileText } from "lucide-react";
import "../App.css";
import NavbarSecond from "./Navbar/NavbarSecond";

const FileUpload = () => {

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

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
            toast.error("Please select a file first!");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        // Get token from localStorage
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("http://localhost:5000/extract", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setJsonData(response.data.data);
                toast.success("Data extracted successfully!", { position: "top-right", autoClose: 3000 });
                setIsOpen(true);    //! modal open here
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
    };

    return (
        <>
            <NavbarSecond title={"Invoice Upload"} path={" / Invoice / Upload"} />
            <div className="flex items-center justify-center min-h-screen px-6 py-16">
                <ToastContainer />
                <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-xl border border-gray-200 space-y-6 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-bold text-indigo-500 flex items-center gap-2">
                        <FileText size={28} /> Invoice Extractor
                    </h2>

                    <label className="relative w-full border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition">
                        <CloudUpload size={40} className="text-indigo-600 mb-2" />
                        <span className="text-indigo-600 font-medium">Click to Upload Invoice</span>
                        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                    </label>

                    {selectedFile && (
                        <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300 text-center shadow-md flex flex-col items-center">
                            <p className="text-gray-700 font-medium">File: <span className="text-indigo-600 font-semibold">{selectedFile.name}</span></p>
                            <p className="text-gray-700 font-medium">Size: <span className="text-indigo-600 font-semibold">{(selectedFile.size / 1024).toFixed(2)} KB</span></p>
                            {preview && <img src={preview} alt="Preview" className="mt-4 w-36 h-36 object-cover rounded-lg border border-gray-300" />}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        className={`w-full py-3 px-6 cursor-pointer flex items-center justify-center gap-2 text-lg font-bold text-white rounded-lg transition-all duration-300 shadow-lg 
                        ${loading ? "bg-indigo-600 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400"}`}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Extract Data"}
                    </button>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                </div>

                <UpdateInvoiceModal isOpen={isOpen} onClose={() => setIsOpen(false)} jsonData={jsonData} setJsonData={setJsonData} />
            </div>
        </>
    );
};

export default FileUpload;