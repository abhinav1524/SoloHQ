import React, { useState } from "react";

const plans = [
  {
    id: 1,
    name: "Basic",
    price: "₹199",
    duration: "1 month",
    features: ["Unlimited captions", "Dedicated support", "Custom integrations"],
  },
  {
    id: 2,
    name: "Pro",
    price: "₹999",
    duration: "6 month",
    features: ["Unlimited captions", "Dedicated support", "Custom integrations"],
  },
  {
    id: 3,
    name: "Premium ",
    price: "₹1999",
    duration: "12 month",
    features: ["Unlimited captions", "Dedicated support", "Custom integrations"],
  },
];

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) return alert("Please select a plan!");
    // Call your backend API to process subscription
    alert(`Subscribed to ${selectedPlan.name} plan!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>

      <div className="flex flex-col justify-center items-center md:flex-row gap-6 w-full">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`w-full max-w-xl border rounded-lg p-6 shadow-md cursor-pointer transform transition 
              hover:scale-105
              ${selectedPlan?.id === plan.id ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}
            onClick={() => handleSelectPlan(plan)}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-2xl font-bold mb-3">{plan.price}</p>
            <p className="text-2xl font-bold mb-4">{plan.duration}</p>
            <ul className="mb-4 space-y-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubscribe}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
