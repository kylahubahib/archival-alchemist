import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const CheckoutUrl = () => {
    const { checkout_url, error } = usePage().props;

    // useEffect(() => {
    //     if (checkout_url) {
    //         // Redirect to the PayMongo checkout page if the URL is provided
    //         //
    //         window.open(checkout_url, '_blank');
    //     } else if (error) {
    //         console.error(error);
    //     }
    // }, [checkout_url, error]);

    return (
        <div className=" bg-customlightBlue">
            {
                error ? (
                    <section className=" mx-48">
                        <div className={`min-h-screen px-12 py-12 mx-auto lg:flex lg:items-center lg:gap-12`} >
                            <div className="w-full lg:w-1/2">
                                <p className="text-6xl md:text-8xl font-medium text-red-600">500</p>
                                <h1 className="mt-3 text-3xl font-semibold text-gray-700 md:text-4xl">Payment Gateway Error</h1>
                                <div className="flex items-center mt-6 gap-x-3">
                                        <a href={route('home')} className="w-1/2 px-5 py-2 text-lg tracking-wide transition-colors duration-200 text-customBlue rounded-lg shrink-0 sm:w-auto">
                                            Go back to homepage
                                        </a>
                                </div>
                            </div>
                            <div className="relative w-full mt-12 lg:w-1/3 lg:mt-0">
                                <img className="w-full max-w-lg lg:mx-auto" src="/images/sad-owl.png" alt="Sad Owl" />
                            </div>
                        </div>
                    </section>
                ) : (
                    <div>
                        <h1>Register Institution</h1>
                        {/* Render loading, error or other content as needed */}
                    </div>
                )
                
            }
        </div>
    );
};

export default CheckoutUrl;
