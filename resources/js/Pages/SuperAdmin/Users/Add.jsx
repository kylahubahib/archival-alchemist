
import TextInput from '@/Components/TextInput';
import { Input, Button, CheckboxGroup, Checkbox, Divider } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FaUser } from "react-icons/fa6";
import { IoMail, IoCheckmarkDone } from "react-icons/io5";
import { MdRemoveDone } from "react-icons/md";
import { adminAccessOptions, handleCheckAll, handleClearAll } from './AccessControl';
import { showToast } from '@/Components/Toast';
import Modal from '@/Components/Modal';

export default function Add({ userType, routeName = 'users.send-admin-registration',
    planUserLimit, remainingUserSlots, uniBranchId, isOpen, onClose }) {

    console.log('uniBranchIdSheesh', uniBranchId);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        user_type: userType,
        uni_branch_id: uniBranchId,
        name: '',
        email: '',
        access: [],
    });

    // useEffect(() => {
    //     setData('uni_branch_id', uniBranchId);
    // },);

    const inputClassName = {
        base: "tracking-wide pb-2",
        input: "border-none focus:ring-0 text-customGray",
        style: {
            border: 'none',
            boxShadow: 'none'
        },
    };
    // Check all access by default
    // useEffect(() => {
    //     if (isOpen) {
    //         return;
    //     } else if (onClose) {
    //         // Add a delay so that resetting the default values will not be visible when the modal closes
    //         const counterModalCloseDelay = setTimeout(() => {
    //             reset();
    //             setDefaultAdminAccess();
    //             clearErrors();
    //         }, 300)

    //         return () => clearTimeout(counterModalCloseDelay);
    //     }

    // }, [onClose])

    const handleSendRegistration = (e) => {
        e.preventDefault();

        if (remainingUserSlots === 0) {
            return (showToast('error',
                <div>
                    Cannot add! There are no <strong>available slots</strong> left.
                </div>,
            ))
        }

        // The `processing` state will automatically be true during the request
        post(route(routeName), {
            data: {
                ...data,  // This will spread the current form data
                uni_branch_id: uniBranchId, // Add the uni_branch_id here
            },
            onSuccess: () => {
                setTimeout(() => {
                    showToast('success',
                        <div>
                            The <strong>{userType === 'admin' ? 'Co-Institution Admin' : 'Co-Super Admin'} registration link</strong>
                            &nbsp;has been successfully sent to <strong className="underline min-w-28 text-blue-600">{data.email}</strong>!
                        </div>,
                        {
                            autoClose: 6000,
                            className: 'min-w-[450px] max-w-sm'
                        });
                }, 300);
                onClose();
            },
        });
    };

    const setDefaultAdminAccess = () => {
        setData(prevData => ({
            ...prevData,
            user_type: userType, // Make sure to reset the userType as well
            access:
                userType === "admin"
                    ? adminAccessOptions.institution_admin.map(option => option.value)
                    : adminAccessOptions.super_admin.map(option => option.value)
        }));
    }

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth={userType === "admin" ? "2xl" : "3xl"}>
            <div className={`bg-customBlue p-3 ${userType === 'admin' && 'text-white p-3 flex justify-between'}`}>
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    {userType === "admin" ? "Add co-institution admin" : "Add co-super admin"}
                </h2>
                {userType === 'admin' && (
                    <div className="flex justify-between items-center gap-3 tracking-wide">
                        <span><strong>Plan User Limit: </strong>{planUserLimit}</span>
                        <Divider className="bg-white" orientation="vertical" />
                        <span><strong>Remaining User Slots: </strong>{remainingUserSlots}</span>
                    </div>
                )
                }
            </div>

            <form onSubmit={handleSendRegistration}>
                <div className="text-customGray flex gap-9 p-6 overflow-auto tracking-wide">

                    {/* Details */}
                    <div className={`flex-grow 1 flex flex-col ${userType === "admin" ? "w-[50%]" : "w-[35%]"} gap-2`}>
                        <div className="pb-2">
                            <label className="font-bold text-md">Details</label>
                            <hr />
                        </div>
                        <Input
                            type="text"
                            radius="sm"
                            labelPlacement="outside"
                            label="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            startContent={<FaUser />}
                            isInvalid={errors.name}
                            errorMessage={errors.name}
                            classNames={inputClassName}
                        />
                        <Input
                            type="email"
                            radius="sm"
                            labelPlacement="outside"
                            label="Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            startContent={<IoMail />}
                            isInvalid={errors.email}
                            errorMessage={errors.email}
                            classNames={inputClassName}
                        />
                    </div>

                    {/* Access Control */}
                    <div className={`flex-grow-2 ${userType === "admin" ? "w-[50%]" : "w-[65%]"} flex flex-col gap-4`}>
                        <div className="flex flex-col gap-2">
                            <div className="pb-2">
                                <label className="font-bold text-md">Access</label>
                                <hr />
                            </div>
                            {userType && (
                                <div>
                                    <CheckboxGroup
                                        value={data.access}
                                        onChange={(value) => setData('access', value)}
                                    >
                                        {userType === "admin" ? (
                                            adminAccessOptions.institution_admin.map((option) => (
                                                <Checkbox key={option.value} value={option.value}>
                                                    {option.label}
                                                </Checkbox>
                                            ))
                                        ) : (
                                            <div className="flex gap-10">
                                                <div className="flex flex-col gap-1 pl-2">
                                                    {adminAccessOptions.super_admin.slice(0, 5).map((option) => (
                                                        <Checkbox key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Checkbox>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {adminAccessOptions.super_admin.slice(5).map((option) => (
                                                        <Checkbox key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Checkbox>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CheckboxGroup>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 justify-center items-center">
                            <Button
                                startContent={<IoCheckmarkDone size={25} />}
                                color="primary"
                                size="md"
                                radius="sm"
                                className="p-2"
                                isDisabled={
                                    userType === 'admin'
                                        ? data.access.length === adminAccessOptions.institution_admin.length
                                        : data.access.length === adminAccessOptions.super_admin.length
                                }
                                onClick={() => handleCheckAll(userType, setData, true, 'access')}
                            >
                                Check all
                            </Button>
                            <Button
                                startContent={<MdRemoveDone size={22} />}
                                color="default"
                                size="md"
                                radius="sm"
                                className="p-2 mr-auto"
                                isDisabled={data.access.length === 0}
                                onClick={() => handleClearAll(setData, true, 'access')}
                            >
                                Clear all
                            </Button>
                        </div>
                    </div>

                </div>


                <div className="bg-customBlue p-2 gap-2 flex justify-end">
                    <Button color="primary" size="sm" type="submit" isLoading={processing}>
                        {processing ? 'Sending...' : 'Send'}
                    </Button>
                    <Button color="danger" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>

        </Modal>
    );
}