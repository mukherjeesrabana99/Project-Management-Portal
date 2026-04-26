import { lazy } from 'react';


import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { Unauthorized } from '../views/unauthorized';



const AuthLogin = Loadable(lazy(() => import('views/auth/index')));



const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
    
      path: '/login',
      element: <AuthLogin />
    },

    {
    
      path: '/unauthorized',
      element: <Unauthorized />
    },
  
   
    
  ]
};

export default AuthenticationRoutes;