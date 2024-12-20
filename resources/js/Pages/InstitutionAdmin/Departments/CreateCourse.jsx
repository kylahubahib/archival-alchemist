import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { router, useForm } from '@inertiajs/react';

export default function CreateCourse({isOpen, onClose, deptId, branchId}) {

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        course_name: '',
        dept_id: deptId,
        uni_branch_id: branchId,
        course_acronym: ''
    });

    const createSubmit = (e) => {
        e.preventDefault();
        post(route('manage-courses.store'), {
            onSuccess: (response) => {
                    onClose();
                    showToast('success', 'Successfully added course!')
                    reset();
            },
        });
    };

    const closeClick = () => {
        reset();
        clearErrors();
        onClose();
    };

    const refreshTable = (id) => {
        axios.get('get-courses', {
            params: { id: id }
        }).then(response => {
            setFilteredData(response.data.courses.data);
            setCourses(response.data.courses.data);
        });
    }


    return (

        <Modal show={isOpen} onClose={closeClick}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">New Course</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={createSubmit}>
                        <div className='space-y-5'>
                            <div className="flex flex-col">
                                <InputLabel htmlFor="course_name" value="Course" />
                                <TextInput
                                    id="course_name"
                                    value={data.course_name}
                                    onChange={(e) => {setData('course_name', e.target.value)}}
                                    className="mt-1 block w-full"
                                    placeholder="Course"
                                />
                                <InputError message={errors.course_name} className="mt-2" />
                            </div>
                            <div className="flex flex-col">
                                <InputLabel htmlFor="course_acronym" value="Course Acronym" />
                                <TextInput
                                    id="course_acronym"
                                    value={data.course_acronym}
                                    onChange={(e) => {setData('course_acronym', e.target.value)}}
                                    className="mt-1 block w-full"
                                    placeholder="Course Acronym"
                                />
                                <InputError message={errors.course_acronym} className="mt-2" />
                            </div>

                            <div className="mt-6 flex">
                                <PrimaryButton type="submit" disabled={processing}>
                                    Save
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-customBlue p-2 flex justify-end" >
                    <button onClick={closeClick} className="text-white text-right mr-5">Close</button>
                </div>
        </Modal>

    );
}
