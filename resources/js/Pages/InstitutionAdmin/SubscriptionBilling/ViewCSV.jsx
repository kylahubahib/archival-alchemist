import { HiBadgeCheck } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { useForm } from "@inertiajs/inertia-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import FileUpload from "@/Components/FileUpload";
import { showToast } from "@/Components/Toast";
import PrimaryButton from "@/Components/PrimaryButton";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export default function ViewCSV({ isOpen, onClose, file, ins_sub}) {
    const [csvData, setCsvData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        axios.get('/institution/read-csv', {
            params: { filePath : ins_sub.insub_content },
        })
        .then(response => {
            if (response.data.success) {
                setCsvData(response.data.csvData);
                //console.log(response.data.csvData);
                //console.log('data:', response.data.csvData[0]);

            } else {
                showToast('info', response.data.message);
            }
        })
        .catch(error => {
            showToast('error', 'Failed to read CSV file.');
        });
    }, [ins_sub]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Validate the file type if it is a CSV or not
        if (file && file.type !== 'text/csv' && file.name.split('.').pop().toLowerCase() !== 'csv') {
            setErrorMessage('Please upload a valid CSV file.');
            setSelectedFile(null);
            return;
        }

        // Clear previous errors and set the selected file
        setErrorMessage('');
        setSelectedFile(file);
        //console.log("Selected file:", file);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            showToast('warning', 'Please select a file.')
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('insubId', ins_sub.id);
        formData.append('university', ins_sub.university_branch.university.uni_name + ' ' + ins_sub.university_branch.uni_branch_name);

        axios.post('/institution/upload-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            if (response.data.success) {
                showToast('success', 'CSV uploaded successfully!');
            } else {
                showToast('info', response.data.message);
            }
        })
        .catch(error => {
            if (error.response) {
                showToast('info', error.response.data.message);
            }
        });
    };



    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="5xl">

            <div className="shadow-sm p-3 justify-between flex flex-row">
                <div></div>
                <h2 className="text-xl text-gray-700 font-bold">Institution CSV List</h2>
                <button onClick={onClose} className="text-gray-600 text-xl hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            <div>
                {(file != null) ? (
                    <div>
                        <Table>
                            <TableHeader>
                                    <TableColumn>Id Number</TableColumn>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Date of Birth</TableColumn>
                                    <TableColumn>Email</TableColumn>
                                    <TableColumn>Type</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {csvData.length > 0 ? (
                                    csvData.map((data) => (
                                        <TableRow key={data}>
                                            <TableCell>{data.id_number}</TableCell>
                                            <TableCell>{data.name}</TableCell>
                                            <TableCell>{data.dob}</TableCell>
                                            <TableCell>{data.email}</TableCell>
                                            <TableCell>{data.type}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>No data available</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ): (
                    <>
                    <form onSubmit={submit}>
                        <div className={`flex items-center justify-center w-full p-3`}>
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
                                    <p className="text-xs text-gray-500">CSV files only</p>
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
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        <PrimaryButton type="submit">
                            UPLOAD
                        </PrimaryButton>
                    </form>
                    </>
                )

                }
            </div>

        </Modal>
    );
}
