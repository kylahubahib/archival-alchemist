import LongTextInput from '@/Components/LongTextInput';
import { router, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { showToast } from '@/Components/Toast';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import TextInput from '@/Components/TextInput';

export default function CreateService({close}) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        content_text: '',
        content_title: '',
        subject: '',
        content_type: ''
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('subject', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCloseCreate = () => {
        setNewService(false);
        reset();
        setPreviewUrl(null);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('store-service'), {
            preserveScroll: true,
            onSuccess: () => {
                showToast('success', 'Service added successfully!');
                handleCloseCreate();
            },
            onError: () => {
                showToast('error', 'Failed to add service.');
            },
        });
    };

    return (
        <div className="p-6 space-y-5">
            <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                    <div className="flex flex-col">
                        <InputLabel htmlFor="subject" value="Service Icon" />
                        <input
                            className="block w-full h-15 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            id="subject"
                            type="file"
                            onChange={handleFileChange}
                        />
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="w-14 h-14 object-cover mt-2" />
                        )}
                        <InputError message={errors.subject} className="mt-2" />
                    </div>

                    <div className="flex flex-col">
                        <InputLabel htmlFor="content_title" value="Title" />
                        <TextInput
                            id="content_title"
                            value={data.content_title}
                            onChange={(e) => setData('content_title', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Title"
                        />
                        <InputError message={errors.content_title} className="mt-2" />
                    </div>

                    <div className="flex flex-col">
                        <InputLabel htmlFor="content_text" value="Content" />
                        <LongTextInput
                            id="content_text"
                            value={data.content_text}
                            onChange={(e) => setData('content_text', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Content"
                        />
                        <InputError message={errors.content_text} className="mt-2" />
                    </div>

                    <div className="mt-6 flex space-x-3">
                        <PrimaryButton type="submit" disabled={processing}>
                            Save
                        </PrimaryButton>
                        <Button onClick={close} radius="large" variant='bordered' size='sm' className=" border-red-500 h-15 text-red-500 shadow">
                            Close
                        </Button>
                    </div>
                </div>
            </form>
        </div>

    );
}
