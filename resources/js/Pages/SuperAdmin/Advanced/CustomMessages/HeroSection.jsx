import LongTextInput from '@/Components/LongTextInput';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { CgClose } from 'react-icons/cg';
import Modal from '@/Components/Modal';
import { showToast } from '@/Components/Toast';
import InputLabel from '@/Components/InputLabel';
import { Divider } from '@nextui-org/react';
import { useEffect } from 'react';

export default function HeroSection({ isOpen, onClose, heroSection = {} }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        content_text: heroSection.content_text || '',
        content_type: heroSection.content_type || '',
        content_title: heroSection.content_title || '',
        subject: heroSection.subject || ''
    });

    useEffect(() => {
        console.log(heroSection);
    });

    const submit = (e) => {

        //console.log('ok')
        e.preventDefault();

        put(route('manage-custom-messages.update', heroSection.id), {
            data,
            preserveScroll: true,
            onSuccess: () => {
                showToast('success', 'Updated Successfully!');
                onClose();
            },
            onError: (errors) => {
                showToast('error', 'Something went wrong!');
            },
        });
    };

    return (


        <Modal show={isOpen} onClose={onClose} maxWidth="5xl">
            <div className="p-3 flex justify-between">
                <h2 className="text-xl text-gray-700 font-bold">Hero Section</h2>

                <button onClick={onClose} className="text-gray-600 p-2 text-xl rounded-full hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            <Divider/>

            <div className="px-5 pb-5 mt-5">
                <form onSubmit={submit} className="space-y-4">
                    <div className="flex flex-col">
                        <InputLabel htmlFor="content_title" value="Title" />
                        <LongTextInput
                            id="content_title"
                            value={data.content_title}
                            onChange={(e) => setData('content_title', e.target.value)}
                            className="mt-1 block w-full min-h-[80px] max-h-[80px] overflow-auto"
                            placeholder="Title here..."
                        />
                        <InputError message={errors.content_title} className="mt-2" />
                    </div>

                    <div className="flex flex-col">
                        <InputLabel htmlFor="subject" value="Subtitle" />
                        <LongTextInput
                            id="subject"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            className="mt-1 block w-full  min-h-[100px] max-h-[100px] overflow-auto"
                            placeholder="Subtitle here..."
                        />
                        <InputError message={errors.subject} className="mt-2" />
                    </div>

                    <div className="flex flex-col">
                        <InputLabel htmlFor="content_text" value="Description" />
                        <LongTextInput
                            id="content_text"
                            value={data.content_text}
                            onChange={(e) => setData('content_text', e.target.value)}
                            className="mt-1 block w-full  min-h-[100px] max-h-[100px] overflow-auto"
                            placeholder="Description here..."
                        />
                        <InputError message={errors.content_text} className="mt-2" />
                    </div>



                    <PrimaryButton type="submit" disabled={processing}>
                        Save
                    </PrimaryButton>

                </form>
            </div>
        </Modal>
    );
}
