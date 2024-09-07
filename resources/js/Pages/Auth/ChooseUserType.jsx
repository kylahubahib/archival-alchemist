import React from 'react';
import Stepper from '@/Components/Stepper';

export default function ChooseUserType({ nextStep, handleChange, values, errors }) {
    const { role } = values;

    const continueStep = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <div className="flex flex-col space-y-4 justify-center">
            <h2 className="text-2xl text-center font-bold mb-4">What type of user are you?</h2>
            <Stepper steps={['1', '2', '3']} currentStep={1} />
            <form onSubmit={continueStep} className="w-full max-w-lg mt-4">
                <div className="space-y-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Select your role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={handleChange('role')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">University Representative</option>
                    </select>
                </div>
                <div className="mt-4 flex">
                    <button type="submit" className="btn btn-primary">Next</button>
                </div>
            </form>
        </div>
    );
}
