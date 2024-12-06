import React, { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import { Button, RadioGroup, Radio } from "@nextui-org/react";
import { useForm } from '@inertiajs/react';
import { showToast } from '@/Components/Toast';

export default function ManuscriptVisibility({ isOpen, onClose, id, title, visibility }) {
    const { data, setData, patch, processing, reset } = useForm({
        manuscript_id: id,
        manuscript_visibility: visibility,
    });

    const visibilityOptions = [
        { label: 'Public', description: 'Accessible to other universities' },
        { label: 'Private', description: 'Accessible to the local university' }
    ];

    // Automatically set the visibility and id when modal opens
    useEffect(() => {
        if (isOpen) {
            setData('manuscript_visibility', visibility);
            setData('manuscript_id', id);
            console.log('visibility', visibility);
        }

    }, [isOpen, id, visibility]);

    // // Reset the value when modal closes
    // useEffect(() => {
    //     // Delay resetting manuscript visibility to avoid immediate change when modal closes.
    //     const counterModalCloseDelay = setTimeout(() => {
    //         reset();
    //     }, 300);

    //     return () => clearTimeout(counterModalCloseDelay);
    // }, [onClose]);

    const handleUpdateManuscriptVisibility = () => {
        patch(route('institution-archives.set-manuscript-visibility'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                showToast('success',
                    <>
                        <strong>{title}</strong> visibility updated successfully.
                    </>,
                    {
                        // autoClose: 6000,
                        className: 'max-w-[400px]',
                    }
                );
                onClose(); // Close the modal on successful update
            },
            onError: (error) => {
                showToast('error', 'Failed to update visibility.');
                console.error(error);
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth={"lg"}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    Manage Visibility
                </h2>
            </div>

            <div className="p-6 space-y-5 overflow-auto tracking-wide">
                <form>
                    <div>
                        <RadioGroup
                            label={<><strong>{title}</strong> Visibility:</>}
                            color="primary"
                            isRequire
                            value={data.manuscript_visibility || visibility}
                            onValueChange={(value) => setData('manuscript_visibility', value)}
                        >
                            {visibilityOptions.map((option) => (
                                <Radio key={option.label} value={option.label} description={option.description}>
                                    {option.label}
                                </Radio>
                            ))}
                        </RadioGroup>
                    </div>
                </form>
            </div>

            <div className="bg-customBlue p-2 gap-2 flex justify-end">
                <Button
                    color="primary"
                    size="sm"
                    // isDisabled={data.manuscript_visibility === visibility}
                    isLoading={processing}
                    onClick={handleUpdateManuscriptVisibility}
                >
                    {processing ? 'Updating...' : 'Update'}
                </Button>
                <Button color="danger" size="sm" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
}
