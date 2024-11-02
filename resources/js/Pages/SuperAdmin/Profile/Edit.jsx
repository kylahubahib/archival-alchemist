import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';
import Modal from '@/Components/Modal';
import { MdMessage } from 'react-icons/md';
import { Accordion, AccordionItem } from '@nextui-org/react';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';



export default function Edit({ auth, mustVerifyEmail, status }) {
    const [activeTab, setActiveTab] = useState('posts');
    const [profilePic, setProfilePic] = useState(auth.user.user_pic);
    const [profilePicChanged, setProfilePicChanged] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { data, setData, post, processing, recentlySuccessful, errors, reset } = useForm({
        user_pic: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(URL.createObjectURL(file));
                setData('user_pic', file);
                setProfilePicChanged(true);
                console.log(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!profilePicChanged || !data.user_pic) {
            console.log('No changes to save or no file selected.');
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmSave = () => {
        const formData = new FormData();
        console.log('Confirm', data.user_pic);
        formData.append('user_pic', data.user_pic);

        axios.post(route('profile.updatePicture'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => {
            setProfilePicChanged(false);
            reset();
            setErrorMessage('');
            setShowConfirmModal(false);
        }).catch((error) => {
            console.error('There was an error updating the profile picture!', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('There was an error updating the profile picture.');
            }
            setShowConfirmModal(false);
            setShowErrorModal(true);
        });
    };

    // useEffect(() => {
    //     console.log('User in Profile:',auth.user);
    // });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
            newProfile={profilePic}
        >
            <Head title="Profile" />

            <div className="py-8 -z-0">
              
                <div className="my-4">
                        
                        <div className="mx-auto sm:px-6 lg:px-10 space-y-4">

                            <Accordion variant='splitted'>
                                <AccordionItem key="1" aria-label="Profile Information" title="Profile Information">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Password Information" title="Password Information">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </AccordionItem> 
                                <AccordionItem key="4" aria-label="Account Deletio" title="Account Deletion">
                                    <DeleteUserForm className="max-w-xl" />
                                </AccordionItem>  
                            </Accordion>
                        </div>
                        
                </div>

               
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Confirm Save</h2>
                    <p>Are you sure you want to save this profile picture?</p>
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                            onClick={handleConfirmSave}
                            disabled={processing}
                        >
                            Confirm
                        </button>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded"
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Error Modal */}
            <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Error</h2>
                    <p>{errorMessage}</p>
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                            onClick={() => setShowErrorModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
