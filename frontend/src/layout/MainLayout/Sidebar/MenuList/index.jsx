import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import { getMenuItems } from 'menu-items';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import adminMenu from '../../../../menu-items/adminMenu';
import clientMenu from '../../../../menu-items/clientMenu';
import userMenu from '../../../../menu-items/userMenu';

const MenuList = () => {
  const token = localStorage.getItem('accessToken');

  let role = localStorage.getItem('loggedRole');


  let menu;

  if (role === "Admin") menu = adminMenu;
  else if (role === "Client") menu = clientMenu;
  else menu = userMenu;

  return (
    <>
      {menu.items.map((item) => (
        <NavGroup key={item.id} item={item} />
      ))}
    </>
  );
};

export default MenuList;