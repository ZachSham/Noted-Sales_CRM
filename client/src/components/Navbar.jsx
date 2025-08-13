import { NavLink } from "react-router-dom";

export default function Navbar() {
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
        </div>
      </nav>
    </div>
  );
}
