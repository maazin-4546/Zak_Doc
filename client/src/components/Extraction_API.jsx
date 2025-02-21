import { useState } from "react";
import axios from "axios";

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
            setFile(file)
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); 
        }
    }

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image first!");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("http://localhost:5000/extract", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setJsonData(response.data.data);
            } else {
                setError("Failed to extract data");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="mt-14 flex flex-col items-center justify-center min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-cyan-700 mb-4">Invoice Data Extraction</h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full h-14 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white text-gray-700 shadow-md hover:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                />

                {selectedFile && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
                        <p className="text-gray-700 font-medium">File Name: <span className="font-semibold text-blue-600">{selectedFile.name}</span></p>
                        <p className="text-gray-700 font-medium">Size: <span className="font-semibold text-blue-600">{(selectedFile.size / 1024).toFixed(2)} KB</span></p>

                        {/* Image Preview */}
                        {preview && (
                            <div className="mt-3">
                                <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border border-gray-300 mx-auto" />
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    className={`w-full mt-6 cursor-pointer py-2 px-4 text-white font-medium rounded-lg transition ${loading ? 'bg-cyan-600 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600'
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Extracting...' : 'Extract'}
                </button>

                {error && <p className="mt-3 text-red-500">{error}</p>}

                {jsonData && (
                    <pre className="mt-6 bg-gray-100 text-gray-700 p-4 rounded-lg text-left w-full max-h-96 overflow-auto border border-gray-300">
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>
                )}
            </div>
        </div>

    );
};

export default InvoiceExtractor;
