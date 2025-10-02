import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CompleteProfile = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const name = state?.name || "";
    const email = state?.email || "";
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(
                "/auth/complete-profile",
                {tempUserId: state.tempUserId, phone, password }
            );
            toast.success("Profile completed successfully");
            navigate("/"); // redirect to your app
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile complition failed ❌");
            console.error(error.response?.data || err.message);
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                <h2>Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            readOnly={true}
                            type="text"
                            value={name}
                            className="peer w-full px-4 pt-5 pb-2 mt-1 rounded-xl bg-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            placeholder="Name"
                        />
                        <label
                            htmlFor="name"
                            className="absolute left-4 top-2 text-sm text-gray-200 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-white"
                        >
                            Name
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            readOnly={true}
                            type="email"
                            value={email}
                            className="peer w-full px-4 pt-5 pb-2 mt-1 rounded-xl bg-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            placeholder="Email"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-4 top-2 text-sm text-gray-200 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-white"
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="peer w-full px-4 pt-5 pb-2 mt-1 rounded-xl bg-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <label
                            htmlFor="phone"
                            className="absolute left-4 top-2 text-sm text-gray-200 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-white"
                        >
                            Phone
                        </label>
                    </div>
                    <div className="relative">
                    <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full px-4 pt-5 pb-2 mt-1 rounded-xl bg-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            placeholder="Name"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-2 text-sm text-gray-200 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-white"
                        >
                            Password
                        </label>
                    </div>
                    <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg">
                    {loading ? "Completing Registraion..." : "Complete Registration"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
