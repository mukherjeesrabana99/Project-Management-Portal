import MainLayout from "../layout/MainLayout";
import { AdminRoutes } from "./AdminRoutes";
import { ClientRoutes } from "./ClientRoutes";
import LandingRouter from "./LandingRouter";
import ProtectedRoutes from "./ProtectedRoutes";
import { UserRoutes } from "./UserRoutes";



const MainRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: <LandingRouter />
    },

    {
      element: <ProtectedRoutes />,
      children: [
        {
          element: <MainLayout />,
          children: [
            AdminRoutes,
            ClientRoutes,
            UserRoutes
          ]
        }
      ]
    }
  ]
};
export default MainRoutes;