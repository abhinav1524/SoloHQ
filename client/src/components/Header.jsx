import { Menu } from "lucide-react";
import Profile from "./Profile";
import NotificationBell from "../pages/NotificationBell";


export default function Header({ setIsSidebarOpen, title }) {

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Profile />
        <NotificationBell />
      </div>
    </div>
  );
}
