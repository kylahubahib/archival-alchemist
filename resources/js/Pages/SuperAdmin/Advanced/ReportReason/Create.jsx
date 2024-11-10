import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import LongTextInput from '@/Components/LongTextInput';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { showToast } from '@/Components/Toast';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        report_type_content: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('manage-report-reason.store'), {
            onSuccess: () => {
                onClose();
                showToast('success', 'Created Successfully!');
                reset();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} closeable={false}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Add New Report Reason</h2>
                </div>

                <div className="p-6 space-y-5">
                <form onSubmit={submit}>
                <div className='space-y-5'>
                    <div className="flex flex-col">
                        <InputLabel htmlFor="report_type_content" value="Reason for Reporting" />
                        <TextInput
                            id="report_type_content"
                            value={data.report_type_content}
                            onChange={(e) => setData('report_type_content', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Reason"
                        />
                        <InputError message={errors.report_type_content} className="mt-2" />
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
