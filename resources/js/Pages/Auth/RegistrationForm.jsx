import { useState, useEffect } from 'react';
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
        user_dob:'',
        password_confirmation: '',
        ins_admin_proof: '',
        course_id: ''
    });

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleChange = (input) => (e) => {
        setData(input, e.target.value);
    };

    useEffect(() => {

        // console.log(data.role);
        // console.log(data.user_dob);
        // console.log(data.ins_admin_proof);
        // console.log(data.uni_branch_id);
    })

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

        <div className="flex flex-col md:flex-row align-middle">
            <div className="min-h-screen md:w-1/2">
                <img src="/images/img2.png" alt="books" className="w-full h-full object-cover" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center space-y-3 p-4 md:p-0">
                <div className="mb-5">
                    <p className="text-2xl md:text-4xl font-bold text-customBlue text-center">WELCOME TO <br/> ARCHIVAL ALCHEMIST!</p>
                </div>

                <div className="w-full max-w-[600px] px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {renderStepContent()}
                </div>

                <div className="text-center">
                    <span>Already have an account?
                        <NavLink href={route('login')} className="text-blue-500 font-semibold"> LOG IN </NavLink>
                    </span>
                </div>
            </div>
        </div>


        //</GuestLayout>
    );
}
