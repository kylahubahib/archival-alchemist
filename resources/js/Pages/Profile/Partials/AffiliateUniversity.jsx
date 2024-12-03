import { FaUniversity } from "react-icons/fa";
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { showToast } from '@/Components/Toast';

export default function AffiliateUniversity({ isOpen, onOpenChange, setIsAffiliated }) {
    const [universities, setUniversities] = useState([]);
    const [message, setMessage] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        uni_branch_id: '',
        uni_id_num: '',
        user_role: ''
    });

    useEffect(() => {
        console.log(data);
    })

    useEffect(() => {
        axios.get('/api/universities-branches')
            .then(response => {
                setUniversities(response.data);
            })
            .catch(error => {
                console.error('Error fetching university data:', error);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();

        setMessage('');
        axios.post('/affiliate-university', data)
            .then((response) => {
                setMessage(response.data.message);
                ///console.log('Success:', response.data.message);
                //console.log('affiliation', response.data.is_affiliated);
                setIsAffiliated(response.data.is_affiliated);
                router.reload();
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Error response:', error.response);
                    setMessage('All fields are required.');
                    if (error.response.status === 500) {
                        console.error('Form submission validation errors:', error.response);
                        setMessage('All fields are required.');
                    }

                } else {
                    console.error('Error:', error.message);
                }
            });
    };



    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                classNames={{
                    backdrop: "bg-gray-500/75"
                }}
                size='xl'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center text-2xl">Connect With Your University</ModalHeader>
                            <ModalBody>
                                <form onSubmit={submit} className="w-full max-w-lg space-y-3">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <FaUniversity color="#294996" size={100} />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel value={'University'} />
                                        <select
                                            id="uni_branch_id"
                                            name="uni_branch_id"
                                            value={data.uni_branch_id}
                                            onChange={(e) => setData('uni_branch_id', e.target.value)}
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
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel value={'Role'} />
                                        <select
                                            id="user_role"
                                            name="user_role"
                                            value={data.user_role}
                                            onChange={(e) => setData('user_role', e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="" disabled>Select a Role</option>
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                        </select>
                                    </div>


                                    <div className="mt-4">
                                        <InputLabel value={'Id Number'} />
                                        <TextInput
                                            id="uni_id_num"
                                            name="uni_id_num"
                                            value={data.uni_id_num}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={(e) => setData('uni_id_num', e.target.value)}
                                        />
                                    </div>

                                    <InputError message={message} className="mt-2" />

                                    <div className="flex items-center justify-between my-10">
                                        <Button type="submit" className="bg-customBlue text-white" disabled={processing}>
                                            {processing ? 'Joining...' : 'Join Affiliation'}
                                        </Button>
                                    </div>
                                </form>

                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
