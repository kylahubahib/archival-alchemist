import Dropdown from '@/Components/Dropdown';
import InputLabel from '@/Components/InputLabel';
import Stepper from '@/Components/Stepper';
import TextInput from '@/Components/TextInput';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JoinAffiliation({ nextStep, prevStep, handleChange, values }) {
    const { uni_branch_id, uni_id_num, role, idnumber } = values;
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        axios.get('/api/universities-branches')
            .then(response => {
                setUniversities(response.data);
            })
            .catch(error => {
                console.error('Error fetching university data:', error);
            });
    }, []);

    const continueStep = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <div className="flex flex-col space-y-4 justify-center">
            <h2 className="text-2xl text-center font-bold mb-4">Join Affiliation</h2>
            <Stepper steps={['1', '2', '3']} currentStep={2} />
            <form onSubmit={continueStep} className="w-full max-w-lg mt-4">
                <InputLabel value={'University'} />
                <select
                    id="uni_branch_id"
                    name="uni_branch_id"
                    value={uni_branch_id}
                    onChange={handleChange('uni_branch_id')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="" disabled>Select a university</option>
                    {universities.map((uni) =>
                        uni.university_branch.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {uni.uni_name} - {branch.uni_branch_name}
                            </option>
                        ))
                    )}
                </select>

                <InputLabel value={'Id Number'} />
                <TextInput
                    id="'uni_id_num"
                    name="'uni_id_num"
                    value={idnumber}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={handleChange('uni_id_num')}
                />

                

                <div className="flex items-center justify-between mt-4">
                    <button type="button" onClick={prevStep} className="btn btn-secondary mr-5">Back</button>
                    <button type="submit" className="btn btn-primary">Next</button>
                </div>
            </form>
        </div>
    );
}
