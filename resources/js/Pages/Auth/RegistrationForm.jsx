import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import ChooseUserType from './ChooseUserType';
import JoinAffiliation from './JoinAffiliation';
import Register from './Register';
import { useForm } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';

export default function RegistrationForm() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors, reset } = useForm({
        role: '',
        uni_branch_id: '',
        uni_id_num: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleChange = (input) => (e) => {
        setData(input, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <ChooseUserType nextStep={nextStep} handleChange={handleChange} values={data} errors={errors} />;
            case 2:
                return <JoinAffiliation nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={data} />;
            case 3:
                return <Register prevStep={prevStep} handleChange={handleChange} values={data} handleSubmit={handleSubmit} errors={errors} />;
            default:
                return <div>Error</div>;
        }
    };

    return (
        //<GuestLayout>

        <div className='flex flex-row align-middle'>
            <div>
                <img src="/images/img2.png" alt="books" className="h-screen" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center space-y-3">
                <div className="mb-5">
                    <p className=" text-4xl font-bold text-customBlue text-center">WELCOME TO <br/> ARCHIVAL ALCHEMIST!</p>
                </div>

                <div className="w-full max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {renderStepContent()}
                </div>

                <div>
                    <span>Already have an account? 
                    <NavLink href={route('login')} className=" text-blue-500 font-semibold">LOG IN</NavLink> </span>
                </div>
            </div>
        </div>
            
        //</GuestLayout>
    );
}
