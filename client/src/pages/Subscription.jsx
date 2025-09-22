import { useEffect, useState} from "react";
import { toast } from "react-hot-toast";
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from "../services/subscriptionServices"; // API calls
import Pagination from "../components/Pagination"; // reusable pagination component
import {useAuth } from "../context/AuthContext";
import { Edit, Trash2 } from "lucide-react";
const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [durationInMonths, setDurationInMonths] = useState("");
  const [features, setFeatures] = useState("");

  const itemsPerPage = 10;
  const {user}  = useAuth();
  // Only admin can access
if (!user || user.role !== "admin") {
  return <div>Access Denied</div>;
}

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data } = await getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching subscriptions ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) return;
    try {
      await deleteSubscription(id);
      toast.success("Subscription deleted successfully ✅");
      fetchSubscriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete ❌");
    }
  };

  const handleOpenModal = (sub = null) => {
    if (sub) {
      setEditingSub(sub);
      setPlanName(sub.planName);
      setPrice(Number(sub.price));
      setDurationInMonths(Number(sub.durationInMonths));
      setFeatures(sub.features.join(", "));
    } else {
      setEditingSub(null);
      setPlanName("");
      setPrice("");
      setDurationInMonths("");
      setFeatures("");
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        planName,
        price,
        durationInMonths,
        features: features.split(",").map((f) => f.trim()),
      };

      if (editingSub) {
        await updateSubscription(editingSub._id, payload);
        toast.success("Subscription updated ✅");
      } else {
        await createSubscription(payload);
        toast.success("Subscription created ✅");
      }

      fetchSubscriptions();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error ❌");
    }
  };

  const filteredSubs = subscriptions.filter((sub) =>
    sub.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedSubs = filteredSubs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search subscription..."
          className="border p-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => handleOpenModal()}
        >
          Add Subscription
        </button>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Plan Name</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Duration (months)</th>
            <th className="py-2 px-4 border">Features</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSubs.map((sub) => (
            <tr key={sub._id} className="text-center">
              <td className="py-2 px-4 border">{sub.planName}</td>
              <td className="py-2 px-4 border">{sub.price}</td>
              <td className="py-2 px-4 border">{sub.durationInMonths}</td>
              <td className="py-2 px-4 border">{sub.features.join(", ")}</td>
              <td className="py-2 px-4 border space-x-2">
                <button
                  className="bg-yellow-400 p-2 rounded cursor-pointer"
                  onClick={() => handleOpenModal(sub)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded cursor-pointer"
                  onClick={() => handleDelete(sub._id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredSubs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-md w-full relative">
            <h2 className="text-lg font-bold mb-4">
              {editingSub ? "Edit" : "Add"} Subscription
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Plan Name"
                className="border p-2 w-full"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Price"
                className="border p-2 w-full"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Duration (months)"
                className="border p-2 w-full"
                value={durationInMonths}
                onChange={(e) => setDurationInMonths(e.target.value)}
                required
              />
              <input
                type="textarea"
                placeholder="Features (comma separated)"
                className="border p-2 w-full"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                required
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {editingSub ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
