// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

const invoices = {
  id: 'invoices',
  type: 'group',
  children: [
    {
      id: 'invoices',
      title: 'Invoices',
      type: 'item',
      url: '/invoices',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default invoices;
