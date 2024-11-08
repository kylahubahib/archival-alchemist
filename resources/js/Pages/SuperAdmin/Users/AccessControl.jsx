import React, { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import { MdRemoveDone } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import { Button, CheckboxGroup, Checkbox, Skeleton } from "@nextui-org/react";
import { showToast } from '@/Components/Toast';
import axios from 'axios';

export const adminAccessOptions = {
    institution_admin: [
        { value: "can_add", label: "Can add" },
        { value: "can_edit", label: "Can edit" },
        { value: "can_delete", label: "Can delete" },
    ],
    super_admin: [
        { value: "dashboard_access", label: "Dashboard" },
        { value: "users_access", label: "Users" },
        { value: "archives_access", label: "Archives" },
        { value: "subscriptions_and_billings_access", label: "Subscriptions & Billings" },
        { value: "user_reports_access", label: "User Reports" },
        { value: "user_feedbacks_access", label: "User Feedbacks" },
        { value: "terms_and_conditions_access", label: "Terms & Conditions" },
        { value: "subscription_plans_access", label: "Subscription Plans" },
        { value: "faqs_access", label: "FAQs" },
        { value: "advanced_access", label: "Advanced" },
    ],
};

export const handleCheckAll = (userType = null, setter, hasUseFormSetter = false, field = '') => {
    if (userType === 'institution_admin') {
        if (hasUseFormSetter) {
            setter(field, adminAccessOptions.institution_admin.map(option => option.value))
        } else {
            setter(adminAccessOptions.institution_admin.map(option => option.value));
        }
    } else {
        if (hasUseFormSetter) {
            setter(field, adminAccessOptions.super_admin.map(option => option.value))
        } else {
            setter(adminAccessOptions.super_admin.map(option => option.value));
        }
    }
}

export const handleClearAll = (setter, hasUseFormSetter = false, field = '') => {
    if (hasUseFormSetter) {
        setter(field, [])
    } else {
        setter([]);
    }
}

export default function AccessControl({ userType, userId, username, isOpen, onClose }) {
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [adminAccess, setAdminAccess] = useState([]);
    const [initialAdminAccess, setInitialAdminAccess] = useState([]);
    const areAccessEqual = adminAccess.length === initialAdminAccess.length
        && JSON.stringify([...adminAccess].sort()) === JSON.stringify([...initialAdminAccess].sort());
    const insAdminSkeletonRows = Array(adminAccessOptions.institution_admin.length).fill(null);
    const superAdminSkeletonRows = Array.from({ length: Math.min(adminAccessOptions.super_admin.length, 5) }).fill(null);

    // Fetches the current access for ins/super admin
    useEffect(() => {
        if (isOpen) {
            // Used to compare the current access to the newly changed access
            setInitialAdminAccess([]);
            fetchAdminAccess();
        }

    }, [isOpen]);


    const fetchAdminAccess = async () => {
        setIsDataLoading(true);

        try {
            const response = await axios.get(route('users.admin-access', userId));
            const currentAccess = [];

            // Store the keys with true values in the adminAccess
            response.data.forEach((access) => {
                Object.entries(access).forEach(([key, value]) => {
                    value === 1 && currentAccess.push(key);
                });
            });
            setAdminAccess(currentAccess);
            setInitialAdminAccess(currentAccess);
            console.log("adminAccess", adminAccess);

        } catch (error) {
            console.error("There was an error while fetching the data", error);
        } finally {
            setIsDataLoading(false);
        }
    };


    const handleUpdateAccess = async () => {
        setIsUpdating(true);

        try {
            await axios.patch(route('users.update-admin-access'), {
                user_id: userId,
                updated_access_columns: adminAccess
            });

            setTimeout(() => {
                showToast('success',
                    <div>
                        <strong>{username}' s</strong>
                        &nbsp;access has been updated successfully!
                    </div>
                );
            }, 400);

        } catch (error) {
            console.error("There was an error while updating the data", error);

        } finally {
            setIsUpdating(false);
            onClose();
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth={`${userType === 'institution_admin' ? 'sm' : 'lg'}`}>
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    Access Control
                </h2>
            </div>

            <div className="p-6 space-y-5 overflow-auto tracking-wide">
                <form>
                    <div className="space-y-5">
                        <div className="flex">
                            {!isDataLoading ? (
                                userType === "institution_admin" ? (
                                    <CheckboxGroup
                                        value={adminAccess}
                                        onChange={setAdminAccess}
                                        label={<>Manage Institution Admin Operations for <strong>{username}</strong></>}
                                    >
                                        {adminAccessOptions.institution_admin.map(option => (
                                            <Checkbox key={option.value} value={option.value}>
                                                {option.label}
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                ) : userType === "super_admin" ? (
                                    <CheckboxGroup
                                        label={<>Manage Super Admin Page Access for <strong>{username}</strong></>}
                                        value={adminAccess}
                                        onChange={setAdminAccess}
                                    >
                                        <div className="flex gap-10">
                                            <div className="flex flex-col gap-1 pl-2">
                                                {adminAccessOptions.super_admin.slice(0, 5).map(option => (
                                                    <Checkbox key={option.value} value={option.value}>
                                                        {option.label}
                                                    </Checkbox>
                                                ))}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {adminAccessOptions.super_admin.slice(5).map(option => (
                                                    <Checkbox key={option.value} value={option.value}>
                                                        {option.label}
                                                    </Checkbox>
                                                ))}
                                            </div>
                                        </div>
                                    </CheckboxGroup>
                                ) : null
                            ) : (
                                // Loading Skeletons for both admin types
                                <>
                                    {userType === "institution_admin" ? (
                                        <CheckboxGroup
                                            label={<>Manage Institution Admin Operations for <strong>{username}</strong></>}
                                        >
                                            <div className="flex flex-col gap-2">
                                                {insAdminSkeletonRows.map((_, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Skeleton className="h-5 w-6 rounded-lg" />
                                                        <Skeleton className="h-4 w-20 rounded-lg" />
                                                    </div>
                                                ))}
                                            </div>
                                        </CheckboxGroup>
                                    ) : userType === "super_admin" ? (
                                        <CheckboxGroup
                                            label={<>Manage Super Admin Page Access for <strong>{username}</strong></>}
                                        >
                                            <div className="flex gap-16">
                                                <div className="flex flex-col gap-2 pl-2">
                                                    {superAdminSkeletonRows.map((_, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Skeleton className="h-5 w-6 rounded-lg" />
                                                            <Skeleton className="h-4 w-36 rounded-lg" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {superAdminSkeletonRows.map((_, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Skeleton className="h-5 w-6 rounded-lg" />
                                                            <Skeleton className="h-4 w-36 rounded-lg" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CheckboxGroup>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <div className="flex gap-3 justify-center items-center">
                            <Button
                                startContent={<MdRemoveDone size={22} />}
                                color="default"
                                size="md"
                                radius="sm"
                                className='p-2'
                                isDisabled={adminAccess.length === 0 || isDataLoading}
                                onClick={() => handleClearAll(setAdminAccess)}
                            >
                                Clear all
                            </Button>
                            <Button
                                startContent={<IoCheckmarkDone size={25} />}
                                color="primary"
                                size="md"
                                radius="sm"
                                className='mr-auto p-2'
                                isDisabled={
                                    userType === 'institution_admin'
                                        ? adminAccess.length === adminAccessOptions.institution_admin.length
                                        : adminAccess.length === adminAccessOptions.super_admin.length
                                        || isDataLoading
                                }
                                onClick={() => handleCheckAll(userType, setAdminAccess)}
                            >
                                Check all
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-customBlue p-2 gap-2 flex justify-end">
                <Button
                    color="primary"
                    size="sm"
                    isLoading={isUpdating}
                    isDisabled={isDataLoading || areAccessEqual}
                    onClick={handleUpdateAccess}
                >
                    {isUpdating ? 'Updating...' : 'Update'}
                </Button>
                <Button color="danger" size="sm" onClick={onClose}>Cancel</Button>
            </div>
        </Modal>
    );
}
