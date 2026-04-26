import { Dashboard } from "../views/client/Dashboard";
import { Profile } from "../views/client/Profile";
import { Projects } from "../views/client/Projects";
import RoleBasedRoutes from "./RolebasedRoutes";


export const ClientRoutes = {
  path: "/client",
  element: <RoleBasedRoutes allowedRoles={["Client"]} />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "profile", element: <Profile /> },
    { path: "projects", element: <Projects /> }
  ]
};