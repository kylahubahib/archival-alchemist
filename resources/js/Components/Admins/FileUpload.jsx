import React from 'react';
import { MdOutlineCloudUpload } from "react-icons/md";

export default function FileUpload({ iconSize = 30, className = '', fileFormat, ...props }) {
    return (
        <div className={`flex items-center justify-center w-full ${className}`}>
            <label
                className="flex flex-col items-center justify-center w-full h-full border-2 
                border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 
                hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center h-full pt-5 pb-6">
                    <MdOutlineCloudUpload size={iconSize} />
                    <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{fileFormat}</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" {...props} />
            </label>
        </div>
    );
}
