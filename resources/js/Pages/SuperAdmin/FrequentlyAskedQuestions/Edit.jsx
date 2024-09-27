import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import LongTextInput from '@/Components/LongTextInput';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ isOpen, onClose, faq }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        content_title: faq.content_title,
        content_text: faq.content_text,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('manage-faqs.update', faq.id), {
            ...data,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                alert('Successfully Updated!');
            },
            onError: (errors) => {
                console.error('Update failed', errors);
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white font-bold">Update Frequently Asked Question</h2>
            </div>

            <div className="p-6 space-y-5">
                <form onSubmit={submit}>
                    <div className='space-y-5'>
                        <div className="flex flex-col">
                            <InputLabel htmlFor="content_title" value="Question" />
                            <TextInput
                                id="content_title"
                                value={data.content_title}
                                onChange={(e) => setData('content_title', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Question"
                            />
                            <InputError message={errors.content_title} className="mt-2" />
                        </div>

                        <div className="flex flex-col">
                            <InputLabel htmlFor="content_text" value="Answer" />
                            <LongTextInput
                                id="content_text"
                                value={data.content_text}
                                onChange={(e) => setData('content_text', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Answer"
                            />
                            <InputError message={errors.content_text} className="mt-2" />
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
    );
}
