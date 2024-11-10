import { CgClose } from "react-icons/cg"; 
import Modal from "./Modal";
import { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import InputLabel from "./InputLabel";
import LongTextInput from "./LongTextInput";
import { useForm } from "@inertiajs/inertia-react";
import InputError from "./InputError";
import axios from "axios"; 

export default function ReportModal({ isOpen, onClose, reportLocation, reportedID }) {
    const [ReportTypes, setReportTypes] = useState([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        reported_id: reportedID, 
        report_location: reportLocation, 
        report_type: '',
        report_desc: '',
        report_attachment: ''
    });

    const submit = (e) => {
        e.preventDefault();
    
        axios.post(route('user-reports.store'), {
            reported_id: reportedID,
            report_location: reportLocation,
            report_type: data.report_type,
            report_desc: data.report_desc,
            report_attachment: data.report_attachment,
        })
        .then(response => {
            if (response.data.success) {
                alert(response.data.message);  
                onClose();  
                reset();    
            } else {
                alert(response.data.message);  
            }
        })
        .catch(error => {
            if (error.response) {
                alert(error.response.data.message);  
                console.log('Error:', error.response.data);  
            }
        });
    };

    useEffect(() => {
        if (isOpen) {
            axios.get('/report-types')
                .then(response => setReportTypes(response.data))
                .catch(error => console.error('Error fetching report types:', error));
        }
    }, [isOpen]);

    return (
        <Modal show={isOpen} onClose={onClose} closeable={true} maxWidth="md">
            <div className="shadow-sm p-3 justify-between flex flex-row">
                <h2 className="text-xl text-gray-700 font-bold">Why would you want to report this?</h2>
                <button onClick={onClose} className="text-gray-600 text-xl hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            <form onSubmit={submit} className="max-w-sm mx-auto p-5 space-y-3 flex flex-col">
                <div className="flex flex-col">
                    <InputLabel>Reason for Reporting</InputLabel>
                    <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={data.report_type} 
                        onChange={(e) => setData('report_type', e.target.value)}
                    >
                        <option value="" disabled>Select a reason</option>
                        {ReportTypes.map((type) => (
                            <option key={type.id} value={type.report_type_content}>
                                {type.report_type_content}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.report_type} className="mt-2" />
                </div>

                <div className="flex flex-col">
                    <InputLabel>Your Message</InputLabel>
                    <LongTextInput
                        placeholder="Provide details for reporting..."
                        value={data.report_desc}
                        onChange={(e) => setData('report_desc', e.target.value)}
                        className={'max-h-44'}
                    />
                    <InputError message={errors.report_desc} className="mt-2" />
                </div>

                <div>
                    <PrimaryButton type="submit" disabled={processing}>
                        Submit Report
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
