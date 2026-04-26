

const projects = {
  id: "projects",
  title: "Projects",
  type: "group",
  roles: ["Admin"],
  children: [
    {
      id: "project-list",
      title: "Project List",
      type: "item",
      url: "/admin/projects",
    },
  ],
};

export default projects;
