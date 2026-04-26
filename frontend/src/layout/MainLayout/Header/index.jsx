import PropTypes from 'prop-types';


import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Button, Typography } from '@mui/material';


import LogoSection from '../LogoSection';
// import SearchSection from './SearchSection';
// import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';


import { IconMenu2 } from '@tabler/icons';

import { BrowserRouter, Link, Route, Router, Routes, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';



const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
 

  return (
    <>
   
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      {/* <ProfileSection /> */}
      {JSON.parse(sessionStorage.getItem('loggedUser')) ? (
        <>
          {/* <Typography color="crimson">Welcome {JSON.parse(sessionStorage.getItem('loggedUser'))}</Typography> */}
          <Button
            color="secondary"
            onClick={(e) => {
              if (confirm('Do you want to Logout?')) {
                // sessionStorage.removeItem('loggedUser');
                // sessionStorage.removeItem('token');
                // sessionStorage.removeItem('loggedRoleId');
                sessionStorage.clear();
                Cookies.remove('accessToken');
                Cookies.remove('accessTokenTime');
                Cookies.remove('refreshToken');
                navigate('/login');
              }
            }}
          >
            LOGOUT
          </Button>
        </>
      ) : (
        <>
          <Button color="secondary" onClick={(e) => navigate('/login')}>
            LOGIN
          </Button>

          
        </>
      )}

 
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
