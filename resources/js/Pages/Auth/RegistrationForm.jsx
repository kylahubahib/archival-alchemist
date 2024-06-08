import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import ChooseUserType from './ChooseUserType';
import JoinAffiliation from './JoinAffiliation';
import Register from './Register';
import axios from 'axios';

export default function RegistrationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: '',
        uni_branch_id: '',
        uni_id_num: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});

    const steps = ['Select Role', 'University Information', 'Registration Form'];

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleChange = (input) => (e) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/register', formData);
            console.log(response.data);
            // Redirect to the login page upon successful registration
            Inertia.visit('/login');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error(error);
            }
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <ChooseUserType nextStep={nextStep} handleChange={handleChange} values={formData} />;
            case 2:
                return <JoinAffiliation nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />;
            case 3:
                return <Register prevStep={prevStep} handleChange={handleChange} values={formData} handleSubmit={handleSubmit} errors={errors} setErrors={setErrors} />;
            default:
                return <div>Error</div>;
        }
    };

    return (
        <GuestLayout>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-lg">
                    {renderStepContent()}
                </div>
            </div>
        </GuestLayout>
    );
}
