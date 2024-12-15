import { HiBadgeCheck } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { useForm } from "@inertiajs/inertia-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import { Spinner } from "@nextui-org/react";
import { router } from "@inertiajs/react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function ViewCSV({ isOpen, onClose, file, ins_sub }) {
    const [insubContent, setInsubContent] = useState(ins_sub.insub_content);
    const [csvData, setCsvData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing , setProcessing] = useState(false);

    useEffect(() => {
        console.log(insubContent);

        // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        if (insubContent != null) {
            axios.get('/institution/read-csv', {
                params: { filePath: insubContent },
            })
                .then(response => {
                    if (response.data.success) {
                        setCsvData(response.data.csvData);
                        setLoading(false);
                    } else {
                        toast.info(response.data.message);
                    }
                })
                .catch(() => {
                    toast.error('Failed to read CSV file.');
                });
        } else {
            setLoading(false);
        }
    }, [insubContent]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type !== 'text/csv' && file.name.split('.').pop().toLowerCase() !== 'csv') {
            setErrorMessage('Please upload a valid CSV file.');
            setSelectedFile(null);
            return;
        }

        setErrorMessage('');
        setSelectedFile(file);
    };

    const submit = (e) => {
        setProcessing(true);

        e.preventDefault();

        if (!selectedFile) {
            toast.warning('Please select a file.', {position: "bottom-right"});
            return;
        }


        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('insubId', ins_sub.id);
        formData.append('university', ins_sub.university_branch.university.uni_name + ' ' + ins_sub.university_branch.uni_branch_name);

        // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        // console.log('Token: ', csrfToken);

        axios.post('/institution/upload-csv', formData, {
            headers: {
                // 'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                if (response.data.success) {
                    toast.success('CSV uploaded successfully!');
                    setTimeout(() => {   
                        onClose();
                        setProcessing(false);
                      router.reload();
                    }, 1000); 
                  } else {
                    toast.info(response.data.message);
                }
            })
            .catch(error => {
                if (error.response) {
                    setProcessing(false);
                    toast.error(error.response.data.message, { position: "top-center" });
                }
            });
    };


    return (
        <>
            <Modal show={isOpen} onClose={onClose} closeable={false} maxWidth='4xl'>
                <div className="shadow-sm p-3 justify-between flex flex-row select-none">
                    <div></div>
                    <h2 className="text-xl text-gray-700 font-bold">Institution CSV List</h2>
                    <button onClick={onClose} className="text-gray-600 text-xl hover:bg-gray-100 rounded-full h-7 w-7 flex justify-center pt-1">
                        <CgClose />
                    </button>
                </div>

                {
                    ins_sub.insub_status === 'Active' ? (
                        <div className="p-3">
                            {!loading ? (
                                <>
                                {!processing ? (
                                    <>
                                    <form onSubmit={submit}>
                                        <div className="flex flex-row justify-between space-x-5 items-center w-full px-3">
                                            <label
                                                htmlFor="dropzone-file"
                                                className="flex items-center justify-center w-full h-10 border-2
                                                border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50
                                                hover:bg-gray-100"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <svg
                                                        className="w-6 h-6 text-gray-500"
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
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload CSV file</span>
                                                    </p>
                                                    {selectedFile && (
                                                        <p className="text-sm text-blue-500 mt-2">
                                                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
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

                                            <PrimaryButton type="submit">UPLOAD</PrimaryButton>
                                        </div>
                                        {errorMessage && (
                                            <p className="text-sm text-red-500 my-2 text-center">
                                                {errorMessage}
                                            </p>
                                        )}
                                    </form>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 select-none">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Id Number</th>
                                                <th scope="col" className="px-6 py-3">Name</th>
                                                <th scope="col" className="px-6 py-3">Date of Birth</th>
                                                <th scope="col" className="px-6 py-3">Email</th>
                                                <th scope="col" className="px-6 py-3">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {csvData.length > 0 ? (
                                                csvData.map((data, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">{data.id_number || 'N/A'}</td>
                                                        <td className="px-6 py-4">{data.name || 'N/A'}</td>
                                                        <td className="px-6 py-4">{data.dob || 'N/A'}</td>
                                                        <td className="px-6 py-4">{data.email || 'N/A'}</td>
                                                        <td className="px-6 py-4">{data.type || 'N/A'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                        No data available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center w-3/4 mx-auto my-10 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg shadow"
                                    >
                                    <p className="text-lg font-medium">
                                        Your file is being processed. This may take a while as we create
                                        accounts, send emails, and handle the uploaded data. We will notify you 
                                        as soon as the processing of the csv file is finish. Thank you!
                                    </p>
                                    <motion.div
                                        className="mt-4 h-2 w-40 bg-yellow-300 rounded-full"
                                        animate={{ scaleX: [1, 0.8, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    </div>
                                )}
                                </>
                            ) : (
                                    <div className="text-center m-40">
                                        <Spinner size="lg" />
                                    </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-3 text-center">
                            <div className="flex flex-col items-center justify-center text-center w-full py-36 p-6 bg-red-50 border border-red-200 rounded-lg shadow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className=" w-20 h-20 text-red-500 mb-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.828 9.172a4 4 0 015.656 0m0 0a4 4 0 010 5.656m-5.656-5.656L5 20m8.485-6.515l6.515 6.515m-6.515-6.515a4 4 0 01-5.656-5.656m0 0a4 4 0 015.656 0z"
                                    />
                                </svg>
                                <p className="text-lg font-medium text-red-700">
                                    Your subscription has expired.
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    Please renew your subscription to gain access to the CSV upload feature.
                                </p>
                            </div>
                        </div>

                    )
                }

        

            </Modal>
            


            <ToastContainer
                autoClose={2000}
                hideProgressBar={false}
                // progressClassName={'!bg-customBlue'}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                // draggable={true}
                pauseOnHover={true}
                theme="light"
                transition={Slide}
            />
        </>
    );
}
