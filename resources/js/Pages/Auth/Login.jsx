import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import React from 'react';
import GoogleButton from './GoogleButton';
import { Divider } from '@nextui-org/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);


    // const submit = (e) => {
    //     e.preventDefault();

    //     post(route('login'));
    // };

    const submit = (e) => {
        e.preventDefault();
    
        // Include CSRF token manually if needed
        // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        // console.log('CSRF TOKEN: ', csrfToken);
    
        // Post with Inertia's useForm
        post(route('login'), {
            headers: {
                // 'X-CSRF-TOKEN': csrfToken, // Include CSRF token
            },
            // withCredentials: true, // Ensure cookies are sent with the request
        });
    };
    
    
    

    return (
        //<GuestLayout>

        <div className="flex flex-col md:flex-row align-middle">
            <div className="h-64 md:min-h-screen md:w-1/2">
                <img src="/images/img2.png" alt="books" className="w-full h-full object-cover" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center space-y-3 p-4 md:p-0">
                <div className="mb-5">
                    <p className=" text-4xl font-bold text-customBlue text-center">ARCHIVAL <br/> ALCHEMIST</p>
                </div>

                <div className="w-full max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">

                    <Head title="Log in" />

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Remember me</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Log in
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
                <div className="text-center">
                    <span>Don't have an account?
                    <NavLink href={route('register')} className=" text-blue-500 font-semibold">REGISTER</NavLink> </span>
                </div>



                <div className="text-center space-y-3 pt-5">
                    <Divider className=" mb-3"/>
                    <span className=" text-lg text-gray-500">or</span>
                    <GoogleButton/>
                </div>
            </div>


        </div>

        //</GuestLayout>
    );
}
