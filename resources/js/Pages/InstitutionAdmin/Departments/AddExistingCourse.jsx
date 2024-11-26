import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { router, useForm } from '@inertiajs/react';
import { Button, Checkbox, CheckboxGroup, select } from '@nextui-org/react';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function AddExistingCourse({isOpen, onClose, deptId}) {
    const [selected, setSelected] = useState([]);
    const [unassignedCourses, setUnassignedCourses] = useState([]);

    // useEffect(() => {
    //     console.log(selected);
    // })

    useEffect(() => {
        axios.get(route('get-unassigned-courses')).then(response => {
            setUnassignedCourses(response.data.courses);
        })
    }, []);

    const handleAssigningCourses = () => {
        axios.post(route('assign-courses'), {
            deptId: deptId,
            courses: selected
        }).then(response => {
            showToast('success', response.data.message);
            //router.reload();
            onClose();
        })
    }

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white font-bold">Assign Existing Courses</h2>
            </div>

            <div className="p-6 space-y-5">
                <CheckboxGroup
                    label="Assign Courses To This Department"
                    color="warning"
                    value={selected}
                    onValueChange={setSelected}
                >
                    {unassignedCourses.map(course => (
                        <Checkbox key={course.id} value={course.id}>
                            {course.course_name}
                        </Checkbox>
                    ))}
                </CheckboxGroup>

                <Button variant='ghost' color='primary' onClick={handleAssigningCourses}> SAVE AND ASSIGN COURSES</Button>
            </div>



            <div className="bg-customBlue p-2 flex justify-end">
                <button onClick={onClose} className="text-white text-right mr-5">Close</button>
            </div>
        </Modal>
    );
}
