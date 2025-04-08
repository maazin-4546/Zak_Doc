import React from 'react';

const DeleteConfirmationModal = ({ openModal, setOpenModal, deleteInvoice }) => {

    const handleToggleModal = () => setOpenModal(!openModal);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <>
            {openModal && (
                <div
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                    onClick={handleCloseModal}
                >

                    <div
                        className="relative w-full max-w-2xl mx-4 animate-slideFadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-lg shadow-xl p-6 transition-all duration-300 ease-in-out">
                            {/* Close Button */}
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4l6 6m0-6l-6 6"
                                    />
                                </svg>
                            </button>

                            {/* Icon & Text in One Row */}
                            <div className="flex items-center gap-4 mb-6">
                                <svg
                                    className="w-12 h-12 text-yellow-500 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Are you sure you want to delete this data?
                                </h3>
                            </div>

                            {/* Buttons - Right aligned */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        deleteInvoice()
                                        handleCloseModal();
                                    }}
                                    className="bg-red-600 cursor-pointer text-white hover:bg-red-700 transition px-5 py-2 text-sm font-medium rounded-lg"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-white cursor-pointer text-gray-700 border border-gray-300 hover:bg-gray-100 transition px-5 py-2 text-sm font-medium rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default DeleteConfirmationModal;



