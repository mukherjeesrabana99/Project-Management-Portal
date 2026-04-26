import { Dashboard } from "../views/user/Dashboard";
import { Profile } from "../views/user/Profile";
import RoleBasedRoutes from "./RolebasedRoutes";


export const UserRoutes = {
  path: "/user",
  element: <RoleBasedRoutes allowedRoles={["User"]} />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "profile", element: <Profile /> }
  ]
};