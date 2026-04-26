import { AdminDashboard } from "../views/admin";
import ClientDashboard from "../views/clients";
import { UserDashboard } from "../views/users";

export const DashboardRouter = () => {
    const role = localStorage.getItem("loggedRole");
  
    if (role === "admin") return <AdminDashboard />;
    if (role === "client") return <ClientDashboard />;
    if (role === "user") return <UserDashboard />;
    return <AdminDashboard />;
  };