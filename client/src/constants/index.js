import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';
import { LayoutDashboard, PackagePlus, CircleUserRound  } from 'lucide-react';
export const navlinks = [
  {
    name: 'dashboard',
    ImgUrl: LayoutDashboard,
    link: '/',
  },
  {
    name: 'campaign',
    ImgUrl: PackagePlus,
    link: '/create-campaign',
  },
  {
    name: 'profile',
    ImgUrl: CircleUserRound,
    link: '/profile',
  },
];
