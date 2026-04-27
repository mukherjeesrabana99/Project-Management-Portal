const userMenu = {
    items: [
      {
        id: "user",
        title: "User",
        type: "group",
        children: [
          { id: "dashboard", title: "Dashboard", type: "item", url: "/user/dashboard" },
          { id: "profile", title: "Profile", type: "item", url: "/user/profile" },
        ]
      }
    ]
  };
  
  export default userMenu;