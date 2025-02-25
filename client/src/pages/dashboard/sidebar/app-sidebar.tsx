import * as React from 'react';
import {
  AppWindowIcon,
  BookOpen,
  Frame,
  Map,
  PanelLeft,
  PieChart,
  Settings2,
  ShoppingCart,
  UserIcon,
  XIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { Button } from '@headlessui/react';
import { useAuth } from '@/stores/AuthContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { logoutUser } from '@/api/login.api';
import { useEvent } from '@/stores/EventContext';
import { useCartStore } from '@/pages/user-dashboard/cart/cart-store';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();
  const { dispatch } = useAuth();
  const nav = useNavigate();
  const onLogout = async () => {
    sessionStorage.removeItem('token');
    dispatch({ type: 'SIGNOUT' });
    logoutUser();
    nav('/');
  };

  const location = useLocation();

  // This is sample data.
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },

    navMain: [
      {
        title: 'Home',
        url: `${location.pathname.split('/')[1]}`,
        icon: AppWindowIcon,
        isActive: true,
        isDropdown: true,
      },
      {
        title: 'Events',
        url: `${location.pathname.split('/')[1]}/events`,
        icon: BookOpen,
        isDropdown: true,
      },
      {
        title: 'Profiles',
        url: '#',
        icon: UserIcon,
        items: [
          {
            title: 'Introduction',
            url: '#',
          },
          {
            title: 'Get Started',
            url: '#',
          },
          {
            title: 'Tutorials',
            url: '#',
          },
          {
            title: 'Changelog',
            url: '#',
          },
        ],
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
          {
            title: 'General',
            url: '#',
          },
          {
            title: 'Team',
            url: '#',
          },
          {
            title: 'Billing',
            url: '#',
          },
          {
            title: 'Limits',
            url: '#',
          },
        ],
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
    ],
  };

  const cart = useCartStore((state) => state.cart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  return (
    <Sidebar
      collapsible='icon'
      {...props}
      className='!bg-red-900'
    >
      <nav className=' border-b absolute top-0 z-50 h-12 w-screen justify-between inline-flex'>
        <button
          onClick={toggleSidebar}
          className=' bg-white  p-1.5 m-1.5 cursor-pointer   shadow-sm rounded-sm w-fit'
        >
          {open ? <XIcon className='h-5' /> : <PanelLeft className='h-5' />}
        </button>

        <p className={`absolute font-semibold top-3 ${open ? 'left-64 ml-10' : 'left-16 ml-2'}`}> </p>

        <Button
          className='relative p-1.5 mr-5 inline-flex items-center gap-x-1'
          onClick={() => toggleCart()}
        >
          {cart.length > 0 && (
            <span className='  bg-red-500 px-1.5 text-white rounded-sm top-1 shadow-sm h-fit'>{cart.length}</span>
          )}
          <ShoppingCart />
        </Button>
      </nav>

      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={onLogout}>Logout</Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
