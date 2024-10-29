import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, usePage, Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FaUserCircle } from 'react-icons/fa';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        user_pic: user.user_pic,
        uni_id_num: user.uni_id_num || '',
        user_pnum: user.user_pnum || '',
        user_aboutme: user.user_aboutme || '',
    });

    const [profilePic, setProfilePic] = useState(user.user_pic);
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     if (data.user_pic) {
    //         setProfilePic(URL.createObjectURL(data.user_pic));
    //     }
    // }, [data.user_pic]);

    const handleFileChange = (e) => {
        setData('user_pic', e.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('uni_id_num', data.uni_id_num);
        formData.append('user_pnum', data.user_pnum);
        formData.append('user_aboutme', data.user_aboutme);
        // if (data.user_pic) {
        //     formData.append('user_pic', data.user_pic);
        // }

        try {
            await axios.patch(route('profile.update'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('There was an error updating the profile!', error);
            setMessage('Error updating profile.');
        }

    };

    return (
        <section className={className}>
            <header>
                {/* <h2 className="text-lg font-medium text-gray-900">Profile Information</h2> */}
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit}  method="POST" encType="multipart/form-data" className="mt-6 space-y-6">
                {/* <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400" />
                        )}
                    </div>
                    <div>
                        <InputLabel htmlFor="user_pic" value="Profile Picture" />
                        <input
                            type="file"
                            id="user_pic"
                            name="user_pic"
                            onChange={handleFileChange}
                            className="mt-1 block w-full"
                        />
                        <InputError className="mt-2" message={errors.user_pic} />
                    </div>
                </div> */}

                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>


                <div>
                    <InputLabel htmlFor="uni_id_num" value="School ID #" />
                    <TextInput
                        id="uni_id_num"
                        className="mt-1 block w-full"
                        value={data.uni_id_num}
                        onChange={(e) => setData('uni_id_num', e.target.value)}
                        autoComplete="uni_id_num"
                    />
                    <InputError className="mt-2" message={errors.uni_id_num} />
                </div>


                <div>
                    <InputLabel htmlFor="user_pnum" value="Phone Number" />
                    <TextInput
                        id="user_pnum"
                        className="mt-1 block w-full"
                        value={data.user_pnum}
                        onChange={(e) => setData('user_pnum', e.target.value)}
                        autoComplete="phone_number"
                    />
                    <InputError className="mt-2" message={errors.user_pnum} />
                </div>

                <div>
                    <InputLabel htmlFor="user_aboutme" value="About Me" />
                    <TextInput
                        id="user_aboutme"
                        className="mt-1 block w-full"
                        value={data.user_aboutme}
                        onChange={(e) => setData('user_aboutme', e.target.value)}
                        autoComplete="user_aboutme"
                    />
                    <InputError className="mt-2" message={errors.user_aboutme} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
                {message && <p>{message}</p>}
            </form>
        </section>
    );
}
