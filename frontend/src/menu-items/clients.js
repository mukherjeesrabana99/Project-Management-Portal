

const clients = {
  id: "clients",
  title: "Clients",
  type: "group",
  roles: ["Admin"],
  children: [
    {
      id: "client-list",
      title: "Client List",
      type: "item",
      url: "/admin/clients",
    },
  ],
};

export default clients;
