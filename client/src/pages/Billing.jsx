import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BillingInfo({ onManagePlan }) {
  const { user } = useAuth();
  const userPlan = user?.subscription;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          Billing Information
        </h1>

        {userPlan ? (
          <div className="space-y-6">
            {/* Plan Card */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-white shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{userPlan.planName}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    userPlan.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {userPlan.status === "active" ? "Active" : "Expired"}
                </span>
              </div>

              <p className="text-gray-700 text-lg font-medium mb-2">
                ₹{userPlan.price} for {userPlan.durationInMonths} {userPlan.durationInMonths > 1 ? "months" : "month"}
              </p>

              <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm mb-4">
                <div>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {new Date(userPlan.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">End Date:</span>{" "}
                  {new Date(userPlan.endDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 mb-2 block">Benefits:</span>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {userPlan.features?.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6 text-lg">
            You don’t have an active plan yet.
          </p>
        )}

        {/* Manage / Choose Plan Button */}
        <div className="flex justify-center mt-6">
          <Link
            to="/plans"
            onClick={onManagePlan}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
          >
            {userPlan ? "Manage Plan" : "Choose a Plan"}
          </Link>
        </div>
      </div>
    </div>
  );
}
