import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const RoleBasedRoutes = ({ allowedRoles=[]}) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("loggedRole");

  console.log("userrole", userRole);
  console.log("allowedRoles", allowedRoles)

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoutes;