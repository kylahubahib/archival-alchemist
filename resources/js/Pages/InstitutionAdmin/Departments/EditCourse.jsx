import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { useForm } from '@inertiajs/react';

export default function EditCourse({isOpen, onClose, deptId, course}) {

    const { data, setData, put, processing, errors, reset } = useForm({
        course_name: course.course_name
    });

    const editSubmit = (e) => {
        e.preventDefault();
        put(route('manage-courses.update', course.id), {
            ...data,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                showToast('success', 'Successfully updated course!');
            },
            onError: (errors) => {
                console.error('Update failed', errors);
            },
        });
    };


    return (
      
        <Modal show={isOpen} onClose={onClose}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Add Department</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={editSubmit}>
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

                            <div className="mt-6 flex">
                                <PrimaryButton type="submit" disabled={processing}>
                                    Save
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-customBlue p-2 flex justify-end" >
                    <button onClick={onClose} className="text-white text-right mr-5">Close</button>
                </div>
        </Modal>

    );
}