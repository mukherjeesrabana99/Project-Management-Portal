import { IconDashboard } from "@tabler/icons";



const users = {
  id: "users",
  title: "Users",
  type: "group",
  roles: ["Admin"],
  children: [
    {
      id: "user-list",
      title: "User List",
      type: "item",
      url: "/admin/users",
    },
  ],
};

export default users;
