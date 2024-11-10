import LongTextInput from '@/Components/LongTextInput';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { CgClose } from 'react-icons/cg';
import Modal from '@/Components/Modal';
import { showToast } from '@/Components/Toast';

export default function PrivacyPolicy({ isOpen, onClose, privacy = {} }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        content_text: privacy.content_text || '',
        content_type: privacy.content_type || '',
        content_title: privacy.content_title || ''
    });

    const submit = (e) => {

        e.preventDefault();
        
        put(route('manage-terms-and-conditions.update', privacy.id), {
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
                <h2 className="text-xl text-gray-700 font-bold">Privacy Policy</h2>

                <button onClick={onClose} className="text-gray-600 p-2 text-xl rounded-full hover:bg-gray-100">
                    <CgClose />
                </button>
            </div>

            <div className="px-5 pb-5">
                <form onSubmit={submit} className="space-y-4">
                    <div className="flex flex-col">
                        <LongTextInput
                            id="content_text"
                            value={data.content_text}
                            onChange={(e) => setData('content_text', e.target.value)}
                            className="mt-1 block w-full min-h-[500px] max-h-[500px] overflow-auto"
                            placeholder="Enter billing agreement here..."
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
