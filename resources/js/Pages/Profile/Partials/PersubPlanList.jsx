import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function PersonalSubscriptionPlanList({}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [plans, setPlans] = useState([]);
    const [planFeatures, setPlanFeatures] = useState([]);

    useEffect(() => {
        console.log(personalPlans);
        console.log(planFeatures);
    },[personalPlans, planFeatures])

    useEffect(() => {
        setLoading(true);
        axios.get('/get-plans').then(response => {
            setPlans(response.data.personalPlans);
            setPlanFeatures(response.data.planFeatures);
            setLoading(false);

        });
    }, []);


    const getFeaturesByPlanId = (planId) => {
        return planFeatures
            .filter(planFeature => planFeature.plan.id === planId)
            .map(planFeature => planFeature.feature.feature_name);
    };

    const handleCheckout = async (planId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/payment', { plan_id: planId });

            if (response.data.checkout_url) {

                // Redirect the user to PayMongo's checkout page
                window.location.href = response.data.checkout_url;
            }
        } catch (err) {
            console.error("Checkout session failed:", err);
            setError("Failed to create checkout session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if(loading) {
        return <div>Loading</div>
    }



    return (
       <>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-5 lg:px-6">
            <div className="flex flex-col space-x-5">

                <div className="mt-8">
                    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                        {plans.map((plan) => (
                            <div key={plan.id} className="flex flex-col p-6 mx-auto min-w-80 max-w-md text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow">
                                <h3 className="mb-4 text-2xl font-semibold">{plan.plan_name}</h3>
                                <p className="font-light text-gray-500 sm:text-lg">{plan.plan_text}</p>
                                <div className="flex justify-center items-baseline my-8">
                                    <span className="mr-2 text-5xl font-extrabold">P{plan.plan_price}</span>
                                    <span className="text-gray-500">{plan.plan_term}</span>
                                </div>
                                <ul role="list" className="mb-8 space-y-3 text-left">
                                    {getFeaturesByPlanId(plan.id).map((featureName, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="text-base font-normal leading-tight text-gray-500 ml-3">
                                                {featureName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto px-4">

                                    <button
                                        className={`w-full block text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleCheckout(plan.id)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Subscribe Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>

            </div>
        </div>
       </>
    );
}
