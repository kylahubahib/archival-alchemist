import React, { useState } from 'react';

export default function FileUpload({ className = '', fileFormat = 'CSV files only', ...props }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Validate the file type is CSV
        if (file && file.type !== 'text/csv' && file.name.split('.').pop().toLowerCase() !== 'csv') {
            setErrorMessage('Please upload a valid CSV file.');
            setSelectedFile(null); // Reset file if not valid
            return;
        }

        // Clear previous errors and set the selected file
        setErrorMessage('');
        setSelectedFile(file);
        console.log("Selected file:", file);  // Optional: Log or handle the file
    };

    return (
        <div className={`flex items-center justify-center w-full ${className}`}>
            <label 
                htmlFor="dropzone-file" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 
                border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 
                hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg 
                        className="w-8 h-8 mb-4 text-gray-500" 
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
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">{fileFormat}</p>
                    {selectedFile && (
                        <p className="text-sm text-blue-500 mt-2">
                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </p>
                    )}
                    {errorMessage && (
                        <p className="text-sm text-red-500 mt-2">
                            {errorMessage}
                        </p>
                    )}
                </div>
                <input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept=".csv"  // Optional: Restrict file picker to CSVs
                    onChange={handleFileChange}  // Handle file selection and validation
                    {...props} 
                />
            </label>
        </div>
    );
}
