import { useSelector, useDispatch } from "react-redux";
import { Bell } from "lucide-react";
import {
  clearNotifications,
  addNotification,
  setNotifications,
  removeNotification,
} from "../features/NotificationSlice";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const userId = user?._id;

  // 🔹 Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          credentials: "include",
        });
        const data = await res.json();
        dispatch(setNotifications(data));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [userId, dispatch]);

  // 🔹 Socket.io setup for real-time notifications
  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000", { withCredentials: true });
    socket.emit("joinRoom", userId);

    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  // 🔹 Clear single notification
  const handleClearNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      dispatch(removeNotification(id));
    } catch (err) {
      console.error("Failed to clear notification:", err);
    }
  };

  // 🔹 Clear all notifications
  const handleClearAll = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/clearall", {
        method: "DELETE",
        credentials: "include",
      });
      dispatch(clearNotifications());
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h4 className="font-semibold">Notifications</h4>
            {notifications.length > 0 && (
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="p-3 border-b cursor-pointer hover:bg-gray-50 bg-gray-100 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <span className="text-xs text-gray-500">{n.type}</span>
                  </div>
                  <button
                    className="text-xs text-red-500 hover:underline"
                    onClick={() => handleClearNotification(n._id)}
                  >
                    Clear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
