
import { IconDashboard } from '@tabler/icons';


const icons = { IconDashboard };



const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  roles: ['Admin', 'Client', 'User'], 
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard'
    }
  ]
};

export default dashboard;

