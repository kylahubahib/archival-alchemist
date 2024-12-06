import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaCircleExclamation } from "react-icons/fa6";
import { showToast } from '@/Components/Toast';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';

<<<<<<<< HEAD:resources/js/Pages/InstitutionAdmin/Faculties/UpdatePlanStatus.jsx
export default function SetPlanStatus({ isOpen, onClose, hasFacultyPremiumAccess,
    name, userId, currentPlanName, action, setFacultiesToRender }) {
========
export default function SetPlanStatus({ isOpen, onClose, hasStudentPremiumAccess,
    name, userId, currentPlanName, action, setStudentsToRender }) {

    console.log('action', action);

    const [isLoading, setIsLoading] = useState(false);
    const params = route().params;
    console.log('hasStudentPremiumAccess', hasStudentPremiumAccess);
>>>>>>>> 22b676a3fa807243c4326f10bfb1ac3ecc32e0d0:resources/js/Pages/InstitutionAdmin/Students/SetPlanStatus.jsx

    console.log('action', action);

    const [isLoading, setIsLoading] = useState(false);
    const params = route().params;
    console.log('hasFacultyPremiumAccess', hasFacultyPremiumAccess);

    const handleUpdatePlanStatus = async () => {
        setIsLoading(true);

        try {
<<<<<<<< HEAD:resources/js/Pages/InstitutionAdmin/Faculties/UpdatePlanStatus.jsx
            const response = await axios.patch(route('institution-faculties.update-plan-status', { ...params, hasFacultyPremiumAccess }), {
========
            const response = await axios.patch(route('institution-students.update-plan-status', { ...params, hasStudentPremiumAccess }), {
>>>>>>>> 22b676a3fa807243c4326f10bfb1ac3ecc32e0d0:resources/js/Pages/InstitutionAdmin/Students/SetPlanStatus.jsx
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

<<<<<<<< HEAD:resources/js/Pages/InstitutionAdmin/Faculties/UpdatePlanStatus.jsx
            setFacultiesToRender(response.data);
========
            setStudentsToRender(response.data);
>>>>>>>> 22b676a3fa807243c4326f10bfb1ac3ecc32e0d0:resources/js/Pages/InstitutionAdmin/Students/SetPlanStatus.jsx

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
