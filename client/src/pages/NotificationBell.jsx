import { useSelector, useDispatch } from "react-redux";
import { Bell } from "lucide-react";
import { clearNotifications, addNotification } from "../features/NotificationSlice";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function NotificationBell({ userId }) {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
   if (!userId) return;

    // 1️⃣ Initialize socket
    const socket = io("http://localhost:5000", { withCredentials: true });

    // 2️⃣ Join user's room for personalized notifications
    socket.emit("joinRoom", userId);

    // 3️⃣ Listen for notifications
    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    });

    // 4️⃣ Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

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
                onClick={() => dispatch(clearNotifications())}
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
                  key={n.id}
                  className="p-3 border-b cursor-pointer hover:bg-gray-50 bg-gray-100"
                >
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <span className="text-xs text-gray-500">{n.type}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
