import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setExtractedText('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/extract-text', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setExtractedText(response.data.extracted_text);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while extracting text.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Extract Text from Image
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-400 hover:shadow-lg p-2"
                    />
                    <button
                        type="submit"
                        className={`w-full cursor-pointer py-2 px-4 text-white font-medium rounded-lg transition ${loading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Extracting...' : 'Upload and Extract'}
                    </button>
                </form>
                {error && (
                    <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
                {extractedText && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Extracted Text:
                        </h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap text-center">
                            {extractedText}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;