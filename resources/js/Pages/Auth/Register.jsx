import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Stepper from '@/Components/Stepper';
import { Checkbox } from '@nextui-org/react';

export default function Register({ prevStep, handleChange, values, handleSubmit, errors }) {
    const { name, email, password, password_confirmation, user_dob } = values;
    const [isSelected, setIsSelected] = useState(false);

    return (
        <>
            <Head title="Register" />
            <Stepper steps={['1', '2', '3']} currentStep={3} />
            <form onSubmit={handleSubmit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        onChange={handleChange('name')}
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
                        value={email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={handleChange('email')}
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
                        value={user_dob}
                        className="my-1 block w-full"
                        onChange={handleChange('user_dob')}
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
                        value={password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleChange('password')}
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
                        value={password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleChange('password_confirmation')}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button type="button" onClick={prevStep}>Back</button>
                    <div>
                        {/* <p className="text-default-500">
                            Selected: {isSelected ? "true" : "false"}
                        </p> */}
                        
                        <PrimaryButton className="ms-4" disabled={!isSelected} type="submit">
                            Register
                        </PrimaryButton>
                    </div>
                </div>
                <div className="flex flex-row gap-2 mt-3 justify-center">
                    <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                        I agree to the 
                    </Checkbox>
                    <a className="text-blue-500 cursor-pointer">terms and condition</a>
                </div>
            </form>
        </>
    );
}
