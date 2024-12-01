import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import LongTextInput from '@/Components/LongTextInput';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function Edit({ isOpen, onClose, universityBranch }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        uni_name: universityBranch.uni_name,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('manage-universities.update', universityBranch.id), {
            ...data,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast('Successfully updated university!')
                reset();
            },
            onError: (errors) => {
                console.error('Update failed', errors);
            },
        });
    };

    return (
        <>
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white font-bold">Update University</h2>
            </div>

            <div className="p-6 space-y-5">
                <form onSubmit={submit}>
                    <div className='space-y-5'>
                        <div className="flex flex-col">
                            <InputLabel htmlFor="University Name" value="Title" />
                            <TextInput
                                id="content_title"
                                value={data.uni_name}
                                onChange={(e) => setData('uni_name', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Title"
                            />
                            <InputError message={errors.uni_name} className="mt-2" />
                        </div>

                        <div className="mt-6 flex">
                            <PrimaryButton type="submit" disabled={processing}>
                                Save
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-customBlue p-2 flex justify-end">
                <button onClick={onClose} className="text-white text-right mr-5">Close</button>
            </div>
        </Modal>

        <ToastContainer />
        </>
    );
}
