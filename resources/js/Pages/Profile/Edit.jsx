import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';
import Modal from '@/Components/Modal';
import { MdMessage } from 'react-icons/md';
import StudentRepository from '@/Pages/Users/Class/Student/Approved';
import TeacherRepository from '@/Components/Manuscripts/TeacherRepository';
import Posts from './Partials/Posts';
import SubscriptionForm from './Partials/SubscriptionForm';
import { Accordion, AccordionItem } from '@nextui-org/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import ChooseARole from './Partials/ChooseARole';



export default function Edit({ auth, mustVerifyEmail, status }) {
    const [activeTab, setActiveTab] = useState('posts');
    const [profilePic, setProfilePic] = useState(auth.user.user_pic);
    const [profilePicChanged, setProfilePicChanged] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userType, setUserType] = useState(null); // Initialize as null or an appropriate values

    useEffect(() => {
      axios.get('/fetch-userType') // Replace with your actual API endpoint
        .then(response => {
          setUserType(response.data.userType); // Update the state with the userType value
        })
        .catch(error => {
          console.error('Error fetching userType:', error);
        });
    }, []); // Empty dependency array means this runs only once after the component mounts

    console.log("User Type: ", userType);


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
            searchProfile={true}
        >
            <Head title="Profile" />

            <div className="py-8 -z-0">
                <div className="max-w-full mx-8 my-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md "
                     style={{ maxWidth: 'calc(100% - 16px)', transition: 'all 0.3s ease-in-out' }}>
                    <div className="flex items-start pt-8">
                        <div className="relative">
                            <div className="flex items-center flex-col space-y-2">
                                <div className="relative w-20 h-20">
                                    <img
                                        src={profilePic}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover" />
                                    <button
                                        className="absolute right-0 bottom-0 bg-gray-300 text-white rounded-full p-1 text-sm w-6 h-6 flex items-center justify-center"
                                        onClick={() => document.getElementById('profilePicInput').click()}
                                    >
                                        ✏️
                                    </button>

                                    <input
                                        type="file"
                                        id="profilePicInput"
                                        name="user_pic"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                {profilePicChanged && (
                                    <button
                                        className="bg-blue-500 text-white py-1 text-sm px-2 rounded"
                                        onClick={handleSave}
                                        disabled={processing}
                                    >
                                        Upload
                                    </button>
                                )}
                                {recentlySuccessful && <p className="text-green-600 mt-2">Profile picture updated successfully!</p>}
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-2xl font-semibold">{auth.user.name}</h3>
                            <p className="text-xs font-medium text-gray-800">Has been a member since {format(new Date(auth.user.created_at), 'yyyy')}</p>
                            <p className="text-sm text-gray-600 mt-2">{auth.user.user_aboutme}</p>
                            {/* <div className="mt-4">
                                <a href={route('chatify')} className="text-gray-600 hover:text-gray-800 flex items-center">
                                    <MdMessage size={32} className="mr-2" />
                                    <span>Message</span>
                                </a>
                            </div> */}
                        </div>
                    </div>

                    <div className="bg-gray-300 h-px my-4"></div>

                    <div className="flex justify-center space-x-6 mt-4">
                        <button
                            className={`bg-white text-gray-600 hover:text-gray-800 py-2 px-4 border-0 ${activeTab === 'posts' ? 'border-b-2 border-gray-800' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        {auth.user.user_type !== 'general_user' && <button
                            className={`bg-white text-gray-600 hover:text-gray-800 py-2 px-4 border-0 ${activeTab === 'repository' ? 'border-b-2 border-gray-800' : ''}`}
                            onClick={() => setActiveTab('repository')}
                        >
                            Repository
                        </button>}
                        <button
                            className={`bg-white text-gray-600 hover:text-gray-800 py-2 px-4 border-0 ${activeTab === 'accountSettings' ? 'border-b-2 border-gray-800' : ''}`}
                            onClick={() => setActiveTab('accountSettings')}
                        >
                            Account Settings
                        </button>
                    </div>
                </div>

                <div className="my-4">
                    {activeTab === 'accountSettings' && (
                        <>

                        <div className="mx-auto sm:px-6 lg:px-10 space-y-4">

                            {/* {auth.user.user_type === 'general_user' && <div className=" p-4 bg-white shadow sm:rounded-lg m-2">
                                <ChooseARole className="max-w-xl" user={auth.user}/>
                            </div>
                            } */}

                            <div className=" p-4 bg-white shadow sm:rounded-lg m-2">
                                <SubscriptionForm className="max-w-xl" user={auth.user}/>
                            </div>

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
                                {/* <AccordionItem key="4" aria-label="Account Deletio" title="Account Deletion">
                                    <DeleteUserForm className="max-w-xl" />
                                </AccordionItem> */}
                            </Accordion>
                        </div>

                        </>
                    )}
                </div>

                <div className="my-4">
                    {activeTab === 'posts' && (
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">


                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <Posts user={auth.user} />
                            </div>

                        </div>
                    )}
                </div>

                <div className="my-4">
                    {activeTab === 'repository' && (
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">


<div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
  {auth.user.user_type === 'student' ? (
    <StudentRepository auth={auth} user={auth.user} className="max-w-xl" />
  ) : (
    <TeacherRepository auth={auth} user={auth.user} className="max-w-xl" />
  )}
</div>


                        </div>
                    )}
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