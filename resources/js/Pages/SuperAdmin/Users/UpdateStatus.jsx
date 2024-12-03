import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaCircleExclamation } from "react-icons/fa6";
import { showToast } from '@/Components/Toast';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';

export default function UpdateStatus({ isOpen, onClose, userId, name, action }) {
    const [isLoading, setIsLoading] = useState(false);

    console.log('name', name);

    const updateStatus = async () => {
        setIsLoading(true);

        try {
            await axios.patch(route('users.update-status'), {
                user_id: userId,
                action: action,
            });

            setTimeout(() => {
                showToast('success',
                    <div>
                        <strong>{name}</strong>
                        &nbsp;has been successfully {action?.toLowerCase()?.concat('d')}!
                    </div>,
                    {
                        className: 'max-w-sm'
                    });
            }, 1000);

        } catch (error) {
            console.error('Error setting user status:', error);
        } finally {
            router.reload();

            setIsLoading(false);
            onClose();
        }

    };

    return (
        <Modal show={isOpen} maxWidth="md" onClose={onClose} >

            <div className="bg-customBlue p-3 tracking-widest" >
                <h2 className="text-xl text-white font-bold">{action}</h2>
            </div>

            <div className="text-customGray p-6 flex flex-col justify-center items-center space-y-5 tracking-wide">
                <FaCircleExclamation size={80} color='orange' />
                <p className='text-xl text-center'>
                    Are you sure you want to {action?.toLowerCase()}
                    <br />
                    <span className='font-bold'>{name}</span>?
                </p>
            </div >

            <div className="bg-customBlue p-2 gap-2 flex items-center justify-end" >
                <Button color="primary" isLoading={isLoading} size='sm' className="capitalize" onClick={updateStatus}>
                    {isLoading ? `${action?.slice(0, -1)?.concat('ing...')}` : 'Yes'}
                </Button>
                <Button color="danger" size='sm' onClick={onClose}>No</Button>
            </div>

        </Modal >
    );
}