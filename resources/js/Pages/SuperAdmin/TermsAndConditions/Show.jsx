import { CgArrowsExchangeAltV } from "react-icons/cg"; 
import Modal from '@/Components/Modal';
import { router } from "@inertiajs/react";

export default function Show({ isOpen, onClose, termConditions }) {
    if (!termConditions) return null; 

    const changeStatus = (id) => {
        router.put(route('manage-terms-and-conditions.change_status', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                alert('Successfully Changed Status!');
            },
            onError: (errors) => {
                console.error('Update failed', errors);
            },
        });
    };


    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-customBlue p-3 text-white flex justify-between">
                <h2 className="text-xl text-white font-bold">View Term and Condition</h2>
                <div className="flex items-center space-x-2">
                    <span>Status: <b>{termConditions.content_status.toUpperCase()}</b></span>
                    <button onClick={() => changeStatus(termConditions.id)} title="Change status" className="focus:outline-none hover:text-customlightBlue">
                    <CgArrowsExchangeAltV size={25} />
                    </button>
                </div>

            </div>

            <div className="p-6 space-y-5">
                <div className="space-y-5">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md">
                            {termConditions.content_title}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md break-words">
                            {termConditions.content_text}
                        </div>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date Created: {termConditions.created_at}</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date Modified: {termConditions.updated_at}</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-customBlue p-2 flex justify-end">
                <button onClick={onClose} className="text-white text-right mr-5">Close</button>
            </div>
        </Modal>
    );
}
