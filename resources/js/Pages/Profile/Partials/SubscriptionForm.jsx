import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Skeleton, useDisclosure } from '@nextui-org/react';
import AffiliateUniversity from './AffiliateUniversity';


export default function SubscriptionForm({}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [personalSubscription, setPersonalSubscription] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user-subscription')
        .then(response => {
            if(response.data.per_sub){
            setPersonalSubscription(response.data.per_sub);
            }
            console.log(personalSubscription);
            setLoading(false); 
        })
        .catch(error => {
            console.error('Error fetching subscription:', error);
        });
    }, []); 

    const viewPlans = async () => {
        window.location.href = route('pricing');
    };


    const formatDate = (dateString) => {
        if (!dateString) return null;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    if (loading) return <div className="space-y-3">
        <header>
            <h2 className="text-lg font-medium text-gray-900">Subscription Information</h2>
            <p className="mt-1 text-sm text-gray-600">
                Manage the subscription and billing of your account
            </p>
        </header>
        <Skeleton className=" h-7 w-28 rounded-lg"/>
        <Skeleton className="h-3 w-40 rounded-lg"/>
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
    </div>;

    return (
        
        <section className="space-y-3">
                <header>
                    <h2 className="text-lg font-medium text-gray-900">Subscription Information</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage the subscription and billing of your account
                    </p>
                </header>
                    {personalSubscription == [] ? (
                        <>  
                            <div className="flex justify-between">
                                <div className="text-gray-700 text-2xl font-bold">{personalSubscription.plan_name}</div>
                                <Button radius="large" variant='bordered' size='sm'>
                                    View Transaction
                                </Button>
                            </div>
                            
                            <div className="text-gray-600 text-base">
                                <span className="font-bold">Renew At: </span> {formatDate(personalSubscription.end_date)}
                            </div>
                            <div className="flex space-x-3">
                                <Button radius="large" variant='bordered' size='sm' className="border-customBlue text-customBlue shadow">
                                    Renew Subscription
                                </Button>
                                <Button radius="large" variant='bordered' size='sm' className=" border-red-500 text-red-500 shadow">
                                    Cancel Subscription
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                        <div className="text-gray-900">You are currently in the free plan.</div>
                        <div className="flex space-x-3">
                            <Button radius="large" variant='bordered' size='sm' className="border-customBlue text-customBlue shadow"
                                onClick={viewPlans}
                            >
                                Upgrade to Premium
                            </Button>
                            <Button radius="large" variant='bordered' size='sm' className=" border-blue-400 text-blue-400 shadow" onPress={onOpen}>
                                Affiliate a university
                            </Button>

                            <AffiliateUniversity isOpen={isOpen} onOpenChange={onOpenChange} />
                        </div>
                        </>
                    )}
        </section>
    );
}
