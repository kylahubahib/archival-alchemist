import Modal from '@/Components/Modal';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function RemoveDepartment({ isOpen, onClose, selectedDept, departments }) {
    const [choices, setChoices] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedDept) {
            setLoading(true);
            axios.get('get-courses', {params: { id: selectedDept.id }}).then(response => {
                setChoices(response.data.courses.data.length > 0);
                setLoading(false);
            }).catch(error => {console.error("Error fetching courses:", error);})
        }
    }, [selectedDept]);

    const handleReassign = (id) => {
        axios.post(route('reassign-courses', id), {dept_id: selectedDept?.id}).then(response => {
            console.log(response.data.message);
            setChoices(false);
        });
    };

    const handleUnassigning = (id) => {
        axios.post(route('unassign-courses', id), {dept_id: selectedDept?.id}).then(response => {
            console.log(response.data.message);
            setChoices(false);
        });
    };

    const deleteDepartment = (id) => {
        router.delete(route('manage-departments.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
};

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white font-bold">Delete Department?</h2>
            </div>

            {/* Show loading spinner or message while fetching data */}
            {loading ? (
                <div className="p-6 text-center"><Spinner /></div>
            ) : choices ? (
                <div>
                    <div className="p-6 pb-3 space-y-5">
                        This department has courses associated with it. Before deleting, will you:
                    </div>

                    <div className="p-6 flex flex-row justify-between items-center">
                        {/* Reassign courses to a different department */}
                        <div>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered" color="primary">REASSIGN TO ANOTHER DEPARTMENT</Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Departments"
                                    items={departments.filter(dept => selectedDept?.id && dept.id !== selectedDept.id)}
                                >
                                    {(dept) => (
                                        <DropdownItem key={dept.id} onClick={() => handleReassign(dept.id)}>
                                            {dept.dept_name}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div>or</div>

                        {/* Unassign the courses */}
                        <div>
                            <Button variant="bordered" color="danger" onClick={() => handleUnassigning(selectedDept.id)}>COURSES REMAIN UNASSIGNED</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-3 space-y-3">
                    <div className="p-6 pb-3 flex justify-center text-lg">
                        Are you sure you want to delete this department?
                    </div>
                    <div className='flex flex-row justify-center space-x-5'>
                        <Button size="lg" color="primary" onClick={() => deleteDepartment(selectedDept?.id)}>Yes</Button>
                        <Button size="lg" color="danger" onClick={onClose}>No</Button>
                    </div>
                </div>
            )}

            <Divider className="mt-3" />
            <div className="p-2 flex justify-end">
                <button onClick={onClose} className="text-gray-500 text-right mr-5">Close</button>
            </div>
        </Modal>
    );
}
