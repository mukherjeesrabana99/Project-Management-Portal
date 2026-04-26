const clientMenu = {
    items: [
      {
        id: "client",
        title: "Client",
        type: "group",
        children: [
          { id: "dashboard", title: "Dashboard", type: "item", url: "/client/dashboard" },
          { id: "projects", title: "Projects", type: "item", url: "/client/projects" }
        ]
      }
    ]
  };
  
  export default clientMenu;