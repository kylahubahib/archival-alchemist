import Dropdown from '@/Components/Dropdown';
import InputLabel from '@/Components/InputLabel';
import Stepper from '@/Components/Stepper';
import TextInput from '@/Components/TextInput';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputError from '@/Components/InputError';
import { Button } from '@nextui-org/react';

export default function JoinAffiliation({ nextStep, prevStep, handleChange, values }) {
    const { uni_branch_id, uni_id_num, role, ins_admin_proof } = values;
    const [universities, setUniversities] = useState([]);
    const [departments, setDepartments] = useState(null);
    const [courses, setCourses] = useState(null);
    const [selectedFile, setSelectedFile] = useState(ins_admin_proof);
    const [errorMessage, setErrorMessage] = useState(null);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        handleChange('ins_admin_proof')({
            target: {
                value: file,
            },
        });
    };

    const checkIfUniversityExist = async (uni_branch_id) => {
        handleChange('uni_branch_id')({
            target: {
                value: uni_branch_id,
            }
        });

        if (uni_branch_id) {
            axios.get(route('get-departments', uni_branch_id)).then(response => {
                console.log(response.data.departments);
                setDepartments(response.data.departments);
            }).catch(error => {
                console.error('Error fetching departments:', error);
            });
        }

        if (role === 'admin') {
            try {
                const response = await axios.get('/check-university-subscription', {
                    params: { uni_branch_id }
                });

                if (response.status === 200) {
                    setErrorMessage(response.data.message);
                } else if (response.status === 204) {
                    setErrorMessage(null);
                }
            } catch (error) {
                console.error('Error checking university subscription:', error);
            }
        }
    };

    const getCourses = (id) => {
        console.log(id);
    };


    return (
        <div className="flex flex-col space-y-4 justify-center">
            <h2 className="text-2xl text-center font-bold mb-4">Join Affiliation</h2>
            <Stepper steps={['1', '2', '3']} currentStep={2} />
            <form onSubmit={continueStep} className="w-full max-w-lg mt-4 space-y-3">
                <InputLabel value="University" />
                <select
                    id="uni_branch_id"
                    name="uni_branch_id"
                    value={uni_branch_id}
                    onChange={(e) => checkIfUniversityExist(e.target.value)}
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

                {role === 'admin' &&
                    <Button size="md" variant="light" color="danger">
                        Can't find your university? Click Here
                    </Button>
                }

                {role === 'teacher' && departments &&
                    <div>
                        <InputLabel value="Courses" />
                        <select
                            onChange={(e) => getCourses(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Select a department</option>
                            {/* {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.dept_name}
                                </option>
                            ))} */}
                            {departments.map((dept) =>
                                dept.course.map((crs) => (
                                    <option key={crs.id} value={crs.id}>
                                        {dept.dept_acronym} - {crs.course_name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                }

                <InputLabel value="Id Number" />
                <TextInput
                    id="uni_id_num"
                    name="uni_id_num"
                    value={uni_id_num}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={handleChange('uni_id_num')}
                />

                {role === 'admin' && (
                    <>
                        <InputLabel value="Proof of University Connection" />
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-12 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-row space-x-2 items-center justify-between p-5">
                                    {selectedFile ? (
                                        <p className="text-sm text-blue-500 mt-2">
                                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500 font-semibold">Click to upload</p>
                                    )}
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </>
                )}

                {errorMessage && (
                    <div className="text-red-500 font-medium mt-2">
                        {errorMessage}
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <button type="button" onClick={prevStep} className="btn btn-secondary mr-5">Back</button>
                    <button type="submit" className={`btn btn-primary ${errorMessage ? 'text-gray-400' : 'text-gray-700'}`} disabled={!!errorMessage}>
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
