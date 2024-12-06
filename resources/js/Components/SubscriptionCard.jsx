import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa"; 
import { formatPrice } from "@/utils";

const SubscriptionCard = () => {
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    isLoading(true);
        axios.get('/get-plans').then(response => {
          setPlans(response.data.personalPlans);
          isLoading(false);
      });
  }, []);

  const handleCheckout = async (planId) => {
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
    }};

    if(loading) return <div className="transparent"></div>

  return (



    <div className="relative text-gray-300 w-full h-full m-0 top-0 bottom-0 right-0 left-0 overflow-hidden" id="pricing">
      {/* Background Blurs */}
      <div
        aria-hidden="true"
        className="absolute w-full h-full inset-0 m-0 opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br to-purple-400 from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-indigo-600"></div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full sm:flex-row gap-4">
        <div className="flex flex-col items-center aspect-auto sm:p-8 border bg-gray-800 border-gray-700 shadow-lg flex-1">
          {/* Icon Circle Above */}
          <div className="flex justify-center items-center w-16 h-16 bg-white-600 rounded-full mb-4">
          <h2 className="text-3xl font-serif text-white mb-4 text-shadow-lg tracking-widest uppercase">
            Archival
          </h2> {/* <FaStar className="text-white text-2xl" /> */}
            <img src='/images/sad-owl.png' alt="PDF Thumbnail" />  
            <h2 className="text-3xl font-serif text-white mb-4 text-shadow-lg tracking-widest uppercase">
              Alchemist
            </h2>
            <div className="w-full h-[1px] bg-gray-500 mb-6"></div>
          </div>

          <p className="text-center mb-6">
            Unlock all features with our premium plan for a low cost. No hidden fees.
          </p>

          <div className="w-full h-full flex flex-wrap gap-4 justify-center">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center sm:p-8 border bg-gray-800 border-gray-700 shadow-lg flex-1 max-w-sm"
                >
                  <h2 className="text-2xl font-serif text-white text-center h-20 mb-4 tracking-widest uppercase">
                    {plan.plan_name}
                  </h2>

                  <button className="border-1 border-gray-50 shadow-sm rounded-xl px-4 my-3">
                    <p className="text-lg sm:text-xl text-center mb-6 mt-4">
                      <span className="text-3xl sm:text-3xl text-white">
                        ₱ {formatPrice(plan.plan_price)}
                      </span>{" "}
                      / {plan.plan_term}
                    </p>
                  </button>

                  <div className="w-full h-[1px] bg-gray-500 mb-6"></div>

                  <a
                    onClick={() => handleCheckout(plan.id)}
                    className="relative flex h-9 w-full items-center justify-center cursor-pointer px-4 before:absolute before:inset-0 before:rounded-full before:bg-white before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-sm font-semibold text-black">
                      Get Started
                    </span>
                  </a>
                </div>
              ))}
          </div>

        </div>
      </div>
    </div>



  );
};

export default SubscriptionCard;
