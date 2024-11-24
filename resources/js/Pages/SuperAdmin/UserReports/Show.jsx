import { CgArrowsExchangeAltV } from "react-icons/cg"; 
import Modal from '@/Components/Modal';
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { formatDate, capitalize } from '@/utils';
import { Button, Divider } from "@nextui-org/react";
import TextInput from "@/Components/TextInput";
import { showToast } from "@/Components/Toast";

export default function Show({ isOpen, onClose, report, content}) {
    const { data, setData, processing, errors, reset } = useForm({
        report_id: report.id,
        duration: '',
        status: ''
    });
    const [suspend, setSuspend] = useState(true);

    useEffect(() => {
            // console.log('Report: ', report); 
            // console.log('Content: ', content);
    })

    const inputDuration = () => {
        setSuspend(false);
        setData('status', 'Solved');
    }

    const warnUser = () => {
        setData('status', 'Dropped');
    
        const reportedUser = (content.user ? content.user.id : content.id);
        
        //console.log('Reported User Id: ', reportedUser);
    
        axios.post(route('user-reports.warning', report.id), {
            status: data.status,
            reportedUser: reportedUser
        })
        .then(response => {
            onClose();
            showToast('success', 'Report reviewed successfully!')
            router.reload();
        })
        .catch(error => {
            onClose();
            showToast('error', 'There was an error: ', error);
            router.reload();
        });
    }
    

    const submit = (e) => {
        e.preventDefault(); 
    
        axios.put(route('user-reports.update', report.id), {
            status: data.status,
            duration: data.duration,
            reportedId: content.id
        })
        .then(response => {
            onClose();
            showToast('success', 'Report reviewed successfully!')
        })
        .catch(error => {
            onClose();
            showToast('error', 'There was an error.')
        });
    };


    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="3xl" closeable={false}>

            <div className=" bg-customBlue border-b-1 p-3 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Report Details</h2>
                <div className="my-2 ">
                <span className="font-semibold text-white">Status:</span> <span className=" rounded-lg border-1 p-1.5 border-gray-200 text-gray-100">{report.report_status}</span>
                </div>
            </div>

            <div className="p-5 bg-white">
            
            <div className="flex flex-row justify-between">
            <div className="mb-2">
                <span className="font-semibold">Reporter Name:</span> {report.user.name}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Date Reported:</span> {formatDate(report.created_at)}
            </div>
            </div>

            <div className="mb-2">
                <span className="font-semibold">Reason for Reporting:</span> {report.report_type}
            </div>
            <div className="mb-2 flex flex-col space-y-1">
                <div className="font-semibold">Description:</div>
                <div className="font-semibold border border-gray-200 rounded-lg p-3">{report.report_desc}</div>
            </div>
            {/* <div className="mt-4">
                <span className="font-semibold">Attachment:</span> 
                {report.report_attachment === null ? (<span className="text-gray-500"> N/A</span>) : (
                    <a href={report.report_attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Attachment
                </a>
                )}
                
            </div> */}

            </div>

            <Divider />

            {report.report_location !== 'Profile' ? (
                <>
                
                <div className=" p-5 bg-white">
                    <div className="mb-2">
                        <span className="font-semibold">Reported User:</span> {content.user.name}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Report Details:</span>
                        {report.report_location === 'Forum' &&
                        <div className="space-y-2">
                            <span className="font-semibold">Title:</span> {content.title}
                            <div className="mb-2 flex flex-col space-y-1">
                                <div className="font-semibold">Contents:</div>
                                <div className="border border-gray-200 rounded-lg p-3">{content.body}</div>
                            </div>
                        </div>}
                    </div>
                    
                    <form onSubmit={submit}>
                    {report.report_status === 'Pending' &&
                    <div className="flex flex-row justify-between mt-5">
                        {suspend ? (
                            <div className="space-x-3">
                            <Button color="warning" radius="large" variant='bordered' size='md'  onClick={warnUser}>
                                Warn User
                            </Button>
                            <Button color="danger" radius="large" variant='bordered' size='md' onClick={inputDuration}>
                            Suspend User and Remove Content
                            </Button>
                            </div>
                        ) : (
                            <>
                            <div className=" flex flex-col">
                                <span>Suspension Duration(Days): </span>
                                <div className=" space-x-3">
                                <TextInput 
                                    type="number"  
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}/>
                                <Button radius="large" variant='solid' size='md' className="bg-customBlue text-white"
                                    type="submit">Submit</Button>
                                </div>
                            </div>
                            
                            </>
                        )}
                    </div>
                    }
                    </form>

                </div>

                </>
            ) : (
                <>
                <div className=" p-5 bg-white">
            
                <div className="mb-5">
                    <span className="font-semibold">Profile Summary:</span>
                    <div className="space-y-1">
                        <div><span className="font-semibold">Reported User:</span> {content.name}</div>
                        <div><span className="font-semibold">Role:</span> {capitalize(content.user_type)}</div>
                        <div><span className="font-semibold">Joined:</span> {formatDate(content.created_at)}</div>
                    </div>
                </div>

                {report.report_status === 'Pending' &&
                <div className="flex flex-row justify-between">
                    {suspend ? (
                            <div className="space-x-3">
                            <Button color="warning" radius="large" variant='bordered' size='md'  onClick={warnUser}>
                                Warn User
                            </Button>
                            <Button color="danger" radius="large" variant='bordered' size='md' onClick={inputDuration}>
                                Suspend User
                            </Button>
                            </div>
                    ) : (
                        <>
                        <div className=" flex flex-col">
                            <span>Suspension Duration: </span>
                            <div className=" space-x-3">
                            <TextInput 
                                type="number"  
                                value={data.duration}
                                onChange={(e) => setData('duration', e.target.value)}/>
                            <Button radius="large" variant='solid' size='md' className="bg-customBlue text-white"
                                type="submit">Submit</Button>
                            </div>
                        </div>
                        
                        </>
                    )}
                </div> 
                }
            
                </div>
                </>
            )}

            <div className="bg-customBlue p-2 py-2 flex justify-between items-center">
                {report.closed_at && (
                    <div className=" text-white">
                    <span className="font-medium">Closed At:</span> {formatDate(report.closed_at)}
                    </div>
                )}
                <button onClick={onClose} className="text-white mr-5">Close</button>
            </div>
        </Modal>
    );
}
