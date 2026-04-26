

import { UserManagement } from "../views/admin/UserManagement";
import { Dashboard } from "../views/admin/Dashboard";
import { ClientManagement } from "../views/admin/ClientManagement";
import { Reports } from "../views/admin/Reports";
import { Settings } from "../views/admin/Settings";
import RoleBasedRoutes from "./RolebasedRoutes";
import { ProjectManagement } from "../views/admin/ProjectManagement";

export const AdminRoutes = {
  path: "/admin",
  element: <RoleBasedRoutes allowedRoles={["Admin"]} />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <UserManagement /> },
    { path: "clients", element: <ClientManagement /> },
    { path: "projects", element: <ProjectManagement /> },
    { path: "reports", element: <Reports /> },
    { path: "settings", element: <Settings /> }
  ]
};