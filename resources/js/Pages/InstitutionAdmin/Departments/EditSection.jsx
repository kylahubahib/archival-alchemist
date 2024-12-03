import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function EditSections({isOpen, onClose, section, sections}) {
    const [errorMessage, setErrorMessage] = useState(null);
    const { data, setData, put, processing, reset } = useForm({
        section_name: section.section_name
    });


    const submit = (e) => {
        e.preventDefault();

        const sectionExist = sections.filter(sec => sec.section_name === data.section_name);

        if(data.section_name === ''){
            setErrorMessage('The section name field is required.');
        } else if (sectionExist.length > 0){
            setErrorMessage('The section name has already been taken.');
        }
        else {
            //setData('course_id', courseId);
            console.log(data);
            put(route('manage-sections.update', section.id), {
                ...data,
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    showToast('success', 'Successfully updated section!');
                },
                onError: (errors) => {
                    console.error('Update failed', errors);
                },
            });
        }

    };

    const closeClick = () => {
        setErrorMessage(null);
        onClose();
    }


    return (

        <Modal show={isOpen} onClose={closeClick}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Edit Section</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={submit}>
                        <div className='space-y-5'>
                            <div className="flex flex-col">
                                <InputLabel htmlFor="section_name" value="Section" />
                                <TextInput
                                    id="section_name"
                                    value={data.section_name}
                                    onChange={(e) => {setData('section_name', e.target.value)}}
                                    className="mt-1 block w-full"
                                    placeholder="Section"
                                />
                                <InputError message={errorMessage} className="mt-2" />
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
