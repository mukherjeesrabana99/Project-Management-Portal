const clientMenu = {
    items: [
      {
        id: "client",
        title: "Client",
        type: "group",
        children: [
          { id: "dashboard", title: "Dashboard", type: "item", url: "/client/dashboard" },
          { id: "users", title: "Users", type: "item", url: "/client/users" },
          { id: "clients", title: "Clients", type: "item", url: "/client/clients" }
        ]
      }
    ]
  };
  
  export default clientMenu;