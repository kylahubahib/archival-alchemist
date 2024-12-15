import React, { useEffect } from 'react';
import { Button, Divider } from '@nextui-org/react';
import { FaCircleExclamation } from "react-icons/fa6";
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { showToast } from '@/Components/Toast';

export default function UpdatePremiumAccess({ routeName = 'institution-students.update-premium-access', planUserLimit, remainingUserSlots, isOpen, onClose, name, userId, action }) {

    console.log('userId update affiliation', userId);
    console.log('action', action);

    const { data, setData, post, processing, clearErrors } = useForm({
        user_id: userId,
        action: action,
    });

    useEffect(() => {
        setData({ user_id: userId, action: action });
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (action === 'Grant' && remainingUserSlots === 0) {
            return (showToast('error',
                <div>
                    Cannot grant institution premium access! There are no <strong>available slots</strong> left.
                </div>,
            ))
        }

        post(route(routeName), {
            onSuccess: () => {
                showToast(
                    'success',
                    <div>
                        <strong>{name}'s</strong> institution premium access has been successfully{' '}
                        <strong>
                            {action?.toLowerCase()}
                            {action?.toLowerCase() === 'grant' ? 'ed' : 'd'}
                        </strong>
                        !
                    </div>,
                    { className: 'max-w-sm' }
                );

                onClose();
            },
            onError: (errors) => {
                console.error('Error:', errors);
            },
            onFinish: () => {
                clearErrors();
            },
        });
    };

    return (
        <Modal show={isOpen} maxWidth="2xl" onClose={onClose}>
            <div className="bg-customBlue text-white p-3 flex justify-between">
                <h2 className="text-xl font-bold">{action} premium access</h2>
                <div className="flex justify-between items-center gap-3 tracking-wide">
                    <span><strong>Plan User Limit: </strong>{planUserLimit}</span>
                    <Divider className="bg-white" orientation="vertical" />
                    <span><strong>Remaining User Slots: </strong>{remainingUserSlots}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="text-customGray p-6 flex flex-col justify-center items-center space-y-5 tracking-wide">
                    <FaCircleExclamation size={80} color="orange" />
                    <p className="text-xl text-center">
                        Are you sure you want to <strong>{action?.toLowerCase()}</strong> the institution premium access for <span className="font-bold">{name}</span>?
                    </p>
                </div>

                <div className="bg-customBlue p-2 gap-2 flex items-center justify-end">
                    <Button
                        type="submit"
                        color="primary"
                        isLoading={processing}
                        size="sm"
                        className="capitalize"
                    >
                        {processing ? `${action?.slice(0, -1)?.concat('ing...')}` : 'Yes'}
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={onClose}
                    >
                        No
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
