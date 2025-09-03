import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.href = "/";
  }

  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/client-manager">
          <img alt="Noted Sales CRM logo" className="h-10 inline" src="/images/Noted_Sales_CRM.png" />
        </NavLink>

        <div className="flex gap-0">
          {/* Client Manager Tile */}
          <NavLink
            to="/client-manager"
            className="bg-white border border-slate-200 px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-center"
          >
            <div className="text-sm font-medium text-slate-900">Client Manager</div>
          </NavLink>

          {/* Upcoming Meetings Tile */}
          <NavLink
            to="/upcoming-meetings"
            className="bg-white border border-slate-200 px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-center"
          >
            <div className="text-sm font-medium text-slate-900">Upcoming Meetings</div>
          </NavLink>

          {/* Task Manager Tile */}
          <NavLink
            to="/task-manager"
            className="bg-white border border-slate-200 px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-center"
          >
            <div className="text-sm font-medium text-slate-900">Task Manager</div>
          </NavLink>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
