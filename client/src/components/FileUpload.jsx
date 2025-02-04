import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {

    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('http://localhost:5000/extract-text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setExtractedText(response.data.extracted_text);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while extracting text.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 flex items-center justify-center p-4 pt-32">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-[#1A56DB] text-center mb-4">
                    Extract Text from Image
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:border-gray-500"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {!file ? (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">File Uploaded!</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Name:</strong> {file.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Type:</strong> {file.type}</p>

                                    {file.type.startsWith('image/') && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="mt-4 w-auto h-32 object-contain rounded-lg"
                                        />
                                    )}
                                </div>
                            )}
                            <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".svg, .png, .jpg, .jpeg, .gif"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={`w-full cursor-pointer py-2 px-4 text-white font-medium rounded-lg transition ${loading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Extracting...' : 'Extract'}
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
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {extractedText}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
