
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Landing from "../views/landing/Landing";

const LandingRouter = () => {
  const token =
    localStorage.getItem("accessToken") || Cookies.get("accessToken");

  if (!token) {
    return <Landing />;
  }

  try {
    const decoded = jwt_decode(token);
    const role = localStorage.getItem("loggedRole") ;

    if (role === "Admin") return <Navigate to="/admin/dashboard" />;
    if (role === "Client") return <Navigate to="/client/dashboard" />;
    return <Navigate to="/user/dashboard" />;
  } catch (err) {
    return <Landing />;
  }
};

export default LandingRouter;