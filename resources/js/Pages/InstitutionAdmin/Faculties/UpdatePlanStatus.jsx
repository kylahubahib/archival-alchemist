import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaCircleExclamation } from "react-icons/fa6";
import { showToast } from '@/Components/Toast';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';

export default function SetPlanStatus({ isOpen, onClose, hasFacultyPremiumAccess,
    name, userId, currentPlanName, action, setFacultiesToRender }) {

    console.log('action', action);

    const [isLoading, setIsLoading] = useState(false);
    const params = route().params;
    console.log('hasFacultyPremiumAccess', hasFacultyPremiumAccess);

    const handleUpdatePlanStatus = async () => {
        setIsLoading(true);

        try {
            const response = await axios.patch(route('institution-faculties.update-plan-status', { ...params, hasFacultyPremiumAccess }), {
                user_id: userId,
                action: action,
            });

            setTimeout(() => {
                showToast('success',
                    <div>
                        <strong>{name}'s</strong>
                        &nbsp;{currentPlanName} has been successfully {action?.toLowerCase()?.concat('d')}!
                    </div>,
                    {
                        className: 'max-w-sm'
                    });
            }, 300);

            setFacultiesToRender(response.data);

        } catch (error) {
            console.error('Error setting plan status:', error);
        } finally {
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
                    Are you sure you want to {action?.toLowerCase()} the <span className="underline">{currentPlanName}</span> for <span className='font-bold'>{name}</span>?
                </p>
            </div >

            <div className="bg-customBlue p-2 gap-2 flex items-center justify-end" >
                <Button
                    color="primary"
                    isLoading={isLoading}
                    size='sm'
                    className="capitalize"
                    onClick={handleUpdatePlanStatus}
                >
                    {isLoading ? `${action?.slice(0, -1)?.concat('ing...')}` : 'Yes'}
                </Button>
                <Button
                    color="danger"
                    size='sm'
                    onClick={onClose}
                >No
                </Button>
            </div>

        </Modal >
    );
}
