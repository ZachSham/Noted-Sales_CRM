import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginNavbar from "./components/LoginNavbar";

const App = () => {
  const location = useLocation();
  const isLoginPage = ["/"].includes(location.pathname);

  return (
    <div className="w-full p-6">
      {isLoginPage ? <LoginNavbar /> : <Navbar />}
      <Outlet />
    </div>
  );
};

export default App;

