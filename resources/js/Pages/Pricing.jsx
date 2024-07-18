import GuestLayout from '@/Layouts/GuestLayout';
import { Link, Head } from '@inertiajs/react';

export default function Pricing({ auth, subscriptionPlans = [], planFeatures = [] }) {

    
    // Helper function to get features by plan_id
    const getFeaturesByPlanId = (planId) => {
        return planFeatures
            .filter(planFeature => planFeature.plan.id === planId)
            .map(planFeature => planFeature.feature.feature_name);
    };

    return (
        <GuestLayout user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pricing</h2>}>
            <Head title="Pricing" />
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-5 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">Our Pricing and Plans</h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl">Choose the perfect plan for you. Archival Alchemist offers affordable and the best plans to enjoy the benefits.</p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {subscriptionPlans.map((plan) => (
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
                                        <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        <span className="text-base font-normal leading-tight text-gray-500 ml-3">
                                            {featureName}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto px-4">
                                <a href="#" className="w-full block text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get started</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GuestLayout>
    );
}
