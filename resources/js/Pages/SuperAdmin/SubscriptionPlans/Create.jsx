import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import LongTextInput from '@/Components/LongTextInput';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ isOpen, onClose, features = {}}) {

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        plan_name: '',
        plan_price: '',
        plan_term: '',
        plan_type: '',
        plan_user_num: '',
        plan_discount: '',
        free_trial_days: '',
        plan_status: '',
        plan_text: '',
        plan_features: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('manage-subscription-plans.store'), {
            onSuccess: () => {
                reset();
                clearErrors();
                onClose();
                alert('Success!');
            },
        });
    };

    const closeClick = () => {
        reset(); 
        clearErrors(); 
        onClose(); 
    };

    const addFeature = (featureId) => {
        setData('plan_features', [...data.plan_features, featureId]);
    };

    const delFeature = (index) => {
        const updatedFeatures = [...data.plan_features];
        updatedFeatures.splice(index, 1);
        setData('plan_features', updatedFeatures);
    };

    const handleFeatureChange = (e) => {
        const featureId = parseInt(e.target.value);
        
        if (featureId && !data.plan_features.includes(featureId)) {
            addFeature(featureId);
        }
    };

    useEffect(() =>{
        console.log(data.plan_features);
    });
 
    return (
        <Modal show={isOpen} onClose={closeClick} maxWidth='5xl'>
            <div className="bg-customBlue p-3" >
                <h2 className="text-xl text-white font-bold">Add Subscription Plan</h2>
            </div>
            
            <form onSubmit={submit}>
                <div className="p-6 space-y-5">
                    <div className="flex flex-row space-x-8">
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
                                    <InputError message={errors.plan_name} className="mt-2" />
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
                                        <option value="Institutional">Institutional</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                    <InputError message={errors.plan_type} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <InputLabel value="Plan Description" />
                                <LongTextInput
                                    id="plan_text"
                                    name="plan_text"
                                    value={data.plan_text}
                                    className="mt-1 block w-full max-h-44"
                                    onChange={(e) => setData('plan_text', e.target.value)}
                                />
                                <InputError message={errors.plan_text} className="mt-2" />
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
                                    <InputError message={errors.plan_term} className="mt-2" />
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
                                    <InputError message={errors.plan_price} className="mt-2" />
                                </div>
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
                                </div>
                            </div>
                        
                        </div>

                        <div className="flex flex-col border border-gray-300 p-4 rounded-md shadow-sm space-y-2">
                            <InputLabel value="Included Features" />
                            <select
                                id="plan_feature"
                                name="plan_feature"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={handleFeatureChange}
                                value=""
                            >
                                <option value="">Select a feature</option>
                                {features.map((feature) => (
                                    <option key={feature.id} value={feature.id}>
                                        {feature.feature_name}
                                    </option>
                                ))}
                            </select>

                            <InputError message={errors.plan_feature} className="mt-2" />
                            <ul>
                                {data.plan_features.map((featureId, index) => (
                                    <li key={index} className="flex justify-between">
                                        {index + 1}. {features.find(f => f.id === featureId)?.feature_name}
                                        <button
                                            type="button"
                                            onClick={() => delFeature(index)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 flex">
                        <PrimaryButton type="submit" disabled={processing}>
                            Save
                        </PrimaryButton>
                    </div>
                </div>

                <div className="bg-customBlue p-2 flex justify-end">
                    <button type="button" onClick={closeClick} className="text-white text-right mr-5">
                        Close
                    </button>
                </div>
            </form>
        </Modal>
    );
}
