
import dashboard from './dashboard';
import clients from './clients';
import users from './users';
import projects from './projects';


export const getMenuItems = (role) => {
  const allItems = [dashboard, clients, users, projects];

  return {
    items: allItems.filter((item) =>
      !item.roles || item.roles.includes(role)
    )
  };
};