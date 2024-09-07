import Modal from '@/Components/Modal';

export default function Show({ isOpen, onClose, termConditions }) {
    if (!termConditions) return null; 

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white font-bold">View Term and Condition</h2>
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
