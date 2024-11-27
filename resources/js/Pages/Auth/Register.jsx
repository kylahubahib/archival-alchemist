import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Stepper from '@/Components/Stepper';
import { Checkbox, Divider } from '@nextui-org/react';
import NavLink from '@/Components/NavLink';
import GoogleButton from './GoogleButton';

export default function Register({}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        user_dob:'',
        password_confirmation: '',
    });
    // const { name, email, password, password_confirmation, user_dob } = values;
    const [isSelected, setIsSelected] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: (page) => {
                    // window.location.href = route('google.auth') 
            },
        });
    };

    return (
        <>
            <Head title="Register" />
            {/* <Stepper steps={['1', '2', '3']} currentStep={3} /> */}

            <div className="flex flex-col md:flex-row align-middle">
            <div className="min-h-screen md:w-1/2">
                <img src="/images/img2.png" alt="books" className="w-full h-full object-cover" />
            </div>
        
            <div className="flex-grow flex flex-col justify-center items-center space-y-3 p-4 md:p-0 my-10">
                <div className="mb-5">
                    <p className="text-2xl md:text-4xl font-bold text-customBlue text-center">WELCOME TO <br/> ARCHIVAL ALCHEMIST!</p>
                </div>
        
                <div className="w-full max-w-[500px] px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="user_dob" value="Date of Birth" />
                        <TextInput
                            id="user_dob"
                            type="date"
                            name="user_dob"
                            value={data.user_dob}
                            className="my-1 block w-full"
                            onChange={(e) => setData('user_dob', e.target.value)}
                            required
                        />
                        <InputError message={errors.user_dob} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-3">
                        {/* <button type="button" onClick={prevStep}>Back</button> */}
                        <div>
                            <PrimaryButton disabled={!isSelected} type="submit">
                                Register
                            </PrimaryButton>
                        </div>
                    </div>

                    <div className="flex flex-row gap-2 mt-5 justify-center">
                        <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                            I agree to the 
                        </Checkbox>
                        <a href={route('terms-and-conditions')}   target="_blank" rel="noopener noreferrer" className="text-blue-500 cursor-pointer">terms and condition</a>
                    </div>

                   
                    
                </form>
                </div>
        
                <div className="text-center">
                    <span>Already have an account?  
                        <NavLink href={route('login')} className="text-blue-500 font-semibold"> LOG IN </NavLink>
                    </span>
                </div>

                <div className="text-center space-y-3 pt-5">
                    <Divider className=" mb-3"/>
                    <span className=" text-lg text-gray-500">or</span>
                    <GoogleButton/>
                </div> 

            </div>
        </div>
          
        </>
    );
}
