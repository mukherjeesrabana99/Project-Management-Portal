const adminMenu = {
    items: [
      {
        id: "admin",
        title: "Admin",
        type: "group",
        children: [
          { id: "dashboard", title: "Dashboard", type: "item", url: "/admin/dashboard" },
          { id: "users", title: "Users", type: "item", url: "/admin/users" },
          { id: "clients", title: "Clients", type: "item", url: "/admin/clients" },
          { id: "projects", title: "Projects", type: "item", url: "/admin/projects" }
        ]
      }
    ]
  };
  
  export default adminMenu;