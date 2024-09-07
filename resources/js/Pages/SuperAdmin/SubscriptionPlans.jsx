import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AddButton from "@/Components/AddButton";
import { FaPlus } from "react-icons/fa";

export default function SubscriptionPlans({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        plan_name: '',
        plan_price: '',
        plan_term: '',
        plan_type: '',
        plan_user_num: '',
        plan_discount: '',
        free_trial_days: '',
        plan_status: '',
        plan_features: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('subscription-plans'));
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addFeature = (feature) => {
        setData('plan_features', data.plan_features.concat(feature));
    };

    const delFeature = (index) => {
        setData('plan_features', data.plan_features.filter((_, i) => i !== index));
    };

    const handleFeatureChange = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeature(e.target.value);
            e.target.value = '';
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subscription Plans</h2>}
        >
            <Head title="Subscription Plans" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between">
                            <div className="p-6 text-gray-900 h-96">Subscription Plans</div>
                            
                            <div className="p-3">
                                <AddButton onClick={openModal} className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add Plan</span>
                                </AddButton>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Add Subscription Plan</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={submit}>
                        <div className='space-y-5'>
                            <div className="flex flex-row space-x-10">
                                <div className="flex flex-col">
                                    <InputLabel value="Plan Name" />
                                    <TextInput
                                        id="plan_name"
                                        type="text"
                                        name="plan_name"
                                        value={data.plan_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('plan_name', e.target.value)}
                                    />
                                    {/* <InputError message={errors.plan_name} className="mt-2" /> */}
                                </div>
                                <div className="flex flex-col">
                                    <InputLabel value="Plan Type" />
                                    <select
                                        id="plan_type"
                                        name="plan_type"
                                        value={data.plan_type}
                                        onChange={(e) => setData('plan_type', e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                    >
                                        <option value="" disabled>Select a plan type</option>
                                        <option value="institutional">Institutional</option>
                                        <option value="personal">Personal</option>
                                    </select>
                                    {/* <InputError message={errors.plan_type} className="mt-2" /> */}
                                </div>
                            </div>

                            <div className="flex flex-row space-x-10">
                                <div className="flex flex-col">
                                    <InputLabel value="Plan Term" />
                                    <select
                                        id="plan_term"
                                        name="plan_term"
                                        value={data.plan_term}
                                        onChange={(e) => setData('plan_term', e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                    >
                                        <option value="" disabled>Select a plan term</option>
                                        <option value="per semester">per semester</option>
                                        <option value="monthly">monthly</option>
                                        <option value="yearly">yearly</option>
                                    </select>
                                    {/* <InputError message={errors.plan_term} className="mt-2" /> */}
                                </div>
                                <div className="flex flex-col">
                                    <InputLabel value="Plan Price" />
                                    <TextInput
                                        id="plan_price"
                                        type="number"
                                        name="plan_price"
                                        value={data.plan_price}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('plan_price', e.target.value)}
                                    />
                                    {/* <InputError message={errors.plan_price} className="mt-2" /> */}
                                </div>
                            </div>

                            <div className="flex flex-col border border-gray-300 p-4 rounded-md shadow-sm">
                                <InputLabel value="Included Features" />
                                <TextInput
                                    id="plan_feature"
                                    type="text"
                                    name="plan_feature"
                                    className="mt-1 block w-52 text-sm h-8 mb-1"
                                    onKeyPress={handleFeatureChange}
                                    placeholder="Add new feature"
                                />
                                {/* <InputError message={errors.plan_feature} className="mt-2" /> */}
                                <ul>
                                    {data.plan_features.map((feature, index) => (
                                        <li key={index} className="flex justify-between">
                                            {index+1}{". "}{feature}
                                            <button type="button" onClick={() => delFeature(index)} className="text-red-500 text-sm">
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-row space-x-10">
                                <div className="flex flex-col">
                                    <InputLabel value="Default Number of Users (if applicable)" />
                                    <TextInput
                                        id="plan_user_num"
                                        type="number"
                                        name="plan_user_num"
                                        value={data.plan_user_num}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('plan_user_num', e.target.value)}
                                    />
                                    {/* <InputError message={errors.plan_user_num} className="mt-2" /> */}
                                </div>
                                <div className="flex flex-col">
                                    <InputLabel value="Number of days for free trial (if applicable)" />
                                    <TextInput
                                        id="free_trial_days"
                                        type="number"
                                        name="free_trial_days"
                                        value={data.free_trial_days}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('free_trial_days', e.target.value)}
                                    />
                                    {/* <InputError message={errors.free_trial_days} className="mt-2" /> */}
                                </div>
                            </div>
                        </div>

                        
                    </form>

                </div>

                <div className="bg-customBlue p-2 flex justify-end" >
                    <button onClick={closeModal} className="text-white text-right mr-5">Close</button>
                </div>
            </Modal>

        </AdminLayout>
    );
}
