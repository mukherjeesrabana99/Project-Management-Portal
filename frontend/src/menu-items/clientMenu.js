const clientMenu = {
    items: [
      {
        id: "client",
        title: "Client",
        type: "group",
        children: [
          { id: "dashboard", title: "Dashboard", type: "item", url: "/client/dashboard" },
          { id: "projects", title: "Projects", type: "item", url: "/client/projects" },
          { id: "profile", title: "Profile", type: "item", url: "/client/profile" }
        ]
      }
    ]
  };
  
  export default clientMenu;