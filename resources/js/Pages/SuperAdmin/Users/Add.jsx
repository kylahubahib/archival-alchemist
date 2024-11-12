
import TextInput from '@/Components/TextInput';
import { Input, Button, CheckboxGroup, Checkbox } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FaUser } from "react-icons/fa6";
import { IoMail, IoCheckmarkDone } from "react-icons/io5";
import { MdRemoveDone } from "react-icons/md";
import { adminAccessOptions, handleCheckAll, handleClearAll } from './AccessControl';
import { showToast } from '@/Components/Toast';
import Modal from '@/Components/Modal';
export default function Add({ userType, isOpen, onClose }) {

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        user_type: userType,
        name: '',
        email: '',
        access: [],
    });

    console.log("add usertype", data.user_type);

    const inputClassName = {
        base: "tracking-wide pb-2",
        input: "border-none focus:ring-0 text-customGray",
        style: {
            border: 'none',
            boxShadow: 'none'
        },
    };
    // Check all access by default
    useEffect(() => {
        if (isOpen) {
            return;
        } else if (onClose) {
            // Add a delay so that resetting the default values will not be visible when the modal closes
            const counterModalCloseDelay = setTimeout(() => {
                reset();
                setDefaultAdminAccess();
                clearErrors();
            }, 300)

            return () => clearTimeout(counterModalCloseDelay);
        }

    }, [onClose])

    const handleSendRegistration = (e) => {
        e.preventDefault();

        // The `processing` state will automatically be true during the request
        post(route('users.send-admin-registration'), {
            onSuccess: () => {
                setTimeout(() => {
                    showToast('success',
                        <div>
                            The <strong>{userType === 'institution_admin' ? 'Co-Institution Admin' : 'Co-Super Admin'} registration link</strong>
                            &nbsp;has been successfully sent to <strong className="underline min-w-28 text-blue-600">{data.email}</strong>!
                        </div>,
                        {
                            autoClose: 6000,
                            className: 'min-w-[450px] max-w-sm'
                        });
                }, 300);
                onClose();

            },
            onError: () => {
                console.log('Error occurred while adding the admin.');
            },
        });
    };

    const setDefaultAdminAccess = () => {
        setData(prevData => ({
            ...prevData,
            user_type: userType, // Make sure to reset the userType as well
            access:
                userType === "institution_admin"
                    ? adminAccessOptions.institution_admin.map(option => option.value)
                    : adminAccessOptions.super_admin.map(option => option.value)
        }));
    }

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth={userType === "institution_admin" ? "xl" : "3xl"}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    {userType === "institution_admin" ? "Add co-institution admin" : "Add co-super admin"}
                </h2>
            </div>

            <form onSubmit={handleSendRegistration}>
                <div className="text-customGray flex gap-9 p-6 overflow-auto tracking-wide">

                    {/* Details */}
                    <div className={`flex-grow 1 flex flex-col ${userType === "institution_admin" ? "w-[50%]" : "w-[35%]"} gap-2`}>
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
                    <div className={`flex-grow-2 ${userType === "institution_admin" ? "w-[50%]" : "w-[65%]"} flex flex-col gap-4`}>
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
                                        {userType === "institution_admin" ? (
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
                                    userType === 'institution_admin'
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