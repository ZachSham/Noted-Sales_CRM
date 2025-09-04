import { NavLink } from "react-router-dom";

export default function LoginNavbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img
            alt="Noted Sales CRM logo"
            className="h-10 inline"
            src="/images/Noted_Sales_CRM.png"
          />
        </NavLink>
      </nav>
    </div>
  );
}
