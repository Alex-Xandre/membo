import * as React from 'react';
import {
  BellIcon,
  Frame,
  LayoutDashboard,
  LogOutIcon,
  Map,
  PanelLeft,
  PartyPopperIcon,
  PieChart,
  Settings2,
  UserIcon,
  UsersIcon,
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

import { Button } from '@headlessui/react';
import { useAuth } from '@/stores/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '@/api/login.api';
import { NavMain } from '@/pages/dashboard/sidebar/nav-main';

export function TenantMainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();
  const { dispatch, allUser, user } = useAuth();
  const nav = useNavigate();

  const data = {
    navMain: [
      {
        title: 'Home',
        url: '/',
        icon: LayoutDashboard,
        isActive: true,
        isDropdown: true,
      },
      {
        title: 'Users',
        url: 'users',
        icon: UsersIcon,
        isDropdown: true,
      },
      {
        title: 'Events',
        url: 'events',
        icon: PartyPopperIcon,
        isDropdown: true,
      },
      {
        title: 'Profile',
        url: 'profile',
        icon: UserIcon,
        isDropdown: true,
      },
      {
        title: 'Billing',
        url: 'billing',
        icon: Settings2,
        isDropdown: true,
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

  const onLogout = async () => {
    sessionStorage.removeItem('token');
    dispatch({ type: 'SIGNOUT' });
    logoutUser();
    nav('/');
  };

  const params = useLocation();

  const tenantName =
    user.role === 'tenant'
      ? user?.accountId
      : allUser?.find((x) => x._id === params.pathname.split('/').filter(Boolean)[0])?.accountId;

  const placeholderAvatar = 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png';

  return (
    <Sidebar
      collapsible='icon'
      {...props}
      className='!bg-red-900'
    >
      <nav className=' border-b absolute top-0 z-50 h-12 w-screen inline-flex justify-between bg-white'>
        <button
          onClick={toggleSidebar}
          className=' bg-white  p-1.5 m-1.5 cursor-pointer   shadow-sm rounded-sm w-fit'
        >
          {open ? <XIcon className='h-5' /> : <PanelLeft className='h-5' />}
        </button>
        <p className={`absolute font-semibold top-3 ${open ? 'left-12 ' : 'left-16 -ml-2'}`}> {tenantName}</p>

        <div className='inline-flex items-center mx-3 gap-2'>
          <BellIcon className='h-5' />
          <img
            src={user.profile ?? placeholderAvatar}
            className='h-6 w-6 rounded-full'
          />
        </div>
      </nav>

      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button
          className='items-center h-fit inline-flex  text-sm gap-x-2 mb-5'
          onClick={onLogout}
        >
          <LogOutIcon className='ml-2 h-5' />
          {open && 'Logout'}{' '}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
