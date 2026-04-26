// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

const items = {
  id: 'items',
  type: 'group',
  children: [
    {
      id: 'items',
      title: 'Items',
      type: 'item',
      url: '/items',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default items;
