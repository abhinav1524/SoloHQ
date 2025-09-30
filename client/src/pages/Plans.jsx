import { useState,useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Plans = () => {
  const [plans ,setPlans]=useState([]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/subscriptions"); // Your backend plans endpoint
        setPlans(data.data); // adjust according to your backend response
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };
    fetchPlans();
  }, []);
  // console.log(plans)
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const {user,setUser} =useAuth();
  const navigate = useNavigate();
  const handleSubscribe = async (plan) => {
    if (!plan) return alert("Select a plan!");
    setLoadingPlanId(plan._id);

    try {
      const { data } = await api.post("/payment/create-order", {
        userId: user._id,
        subscriptionPlan: plan.planName,
        price: plan.price,
        features:plan.features
      });

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // if using Vite
        amount: order.price,
        currency: order.currency,
        name: "SoloHQ",
        description: `Subscription - ${plan.planName}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // Refetch updated user data
            const userRes = await api.get("/auth/me"); // or your endpoint to get current user
            setUser(userRes.data.user); // update context
            alert(
              `Payment successful! Subscription valid until ${verifyRes.data.payment.expiresAt}`
            );
            navigate("/billing")
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating order. Try again.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>

      <div className="flex flex-col justify-center items-center md:flex-row gap-6 w-full">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`w-full max-w-xl border rounded-lg p-6 shadow-md cursor-pointer transform transition 
              hover:scale-105
              ${selectedPlan?.id === plan._id ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.planName}</h2>
            <p className="text-2xl font-bold mb-3">₹{plan.price}</p>
            <p className="text-2xl font-bold mb-4">{plan.durationInMonths} Month</p>
            <ul className="mb-4 space-y-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() =>{setSelectedPlan(plan); handleSubscribe(plan)}}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              disabled={loadingPlanId === plan.id}
            >
              {loadingPlanId === plan.id ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
