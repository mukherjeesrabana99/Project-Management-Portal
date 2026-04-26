// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

const vendors = {
  id: 'vendors',
  type: 'group',
  children: [
    {
      id: 'vendors',
      title: 'Vendors',
      type: 'item',
      url: '/vendors',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default vendors;
