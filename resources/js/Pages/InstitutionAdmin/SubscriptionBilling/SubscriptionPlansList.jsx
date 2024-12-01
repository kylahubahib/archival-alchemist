import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { formatPrice } from '@/utils';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function SubscriptionPlansList({ user, plans = [], planFeatures = [] }) {
    const [numberOfUser, setNumberOfUser] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    const getFeaturesByPlanId = (planId) => {
        return planFeatures
            .filter(planFeature => planFeature.plan.id === planId)
            .map(planFeature => planFeature.feature.feature_name);
    };

    const handleCheckout = async (planId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/payment', { plan_id: planId, num_user: numberOfUser });

            if (response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            }
        } catch (err) {
            console.error("Checkout session failed:", err);
            setError("Failed to create checkout session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 px-4 mx-auto lg:py-5 lg:px-6">
            <div className="space-y-8 lg:flex lg:flex-wrap lg:gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="flex flex-col md:flex-row items-start p-6 text-gray-900 bg-white rounded-lg border border-gray-100 shadow-md overflow-hidden"
                    >
                        {/* Plan Info */}
                        <div className="md:w-1/3 flex-shrink-0">
                            <h3 className="mb-4 text-2xl font-semibold">{plan.plan_name}</h3>
                            <p className="font-light text-gray-500">{plan.plan_text}</p>
                            <div className="flex items-baseline mt-4">
                                <span className="mr-2 text-4xl">₱ <strong>{formatPrice(plan.plan_price)}</strong></span>
                                <span className="text-gray-500">{plan.plan_term}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="md:w-1/3 mb-8 space-y-2 text-left pl-0 md:pl-8">
                            {getFeaturesByPlanId(plan.id).map((featureName, index) => (
                                <li key={index} className="flex items-center">
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-green-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="text-base font-normal leading-tight text-gray-500 ml-3">
                                        {featureName}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Subscribe Section */}
                        <div className="md:w-1/3 px-4 space-y-4">
                            <div className="flex flex-col">
                                <InputLabel htmlFor={`num_user_${plan.id}`} value="Number of Users" />
                                <TextInput
                                    id={`num_user_${plan.id}`}
                                    type="number"
                                    name={`num_user_${plan.id}`}
                                    value={numberOfUser}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., 100"
                                    min={100}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || '';
                                        setNumberOfUser(value);
                                        setTotalAmount(plan.plan_price * value);
                                    }}
                                    required
                                />
                                <InputError message={error} className="mt-2" />
                            </div>

                            <p className="text-lg font-semibold text-gray-700">
                                Total: ₱ {formatPrice(totalAmount)}
                            </p>

                            <button
                                className={`w-full block text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading || numberOfUser <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleCheckout(plan.id)}
                                disabled={loading || numberOfUser <= 0}
                            >
                                {loading ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
