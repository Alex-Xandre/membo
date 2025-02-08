import * as React from 'react';
import {
  AppWindowIcon,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PanelLeft,
  PieChart,
  Settings,
  Settings2,
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
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '@/api/login.api';

export function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();
  const { dispatch, allUser } = useAuth();
  const nav = useNavigate();

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ],
    navMain: [
      {
        title: 'Home',
        url: '/',
        icon: AppWindowIcon,
        isActive: true,
        isDropdown: true,
      },
      {
        title: 'Tenants',
        url: '#',
        icon: BookOpen,
        items: allUser
          .filter((x) => x.role !== 'user')
          .map((item) => {
            return {
              title: item.accountId,
              url: `/${item._id}`,
            };
          }),
      },
      {
        title: 'Profile',
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
        icon: Settings,
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

  const tenantName = allUser?.find((x) => x._id === params.pathname.split('/').filter(Boolean)[0])?.accountId;

  return (
    <Sidebar
      collapsible='icon'
      {...props}
      className='!bg-red-900'
    >
      <nav className=' border-b absolute top-0 z-50 h-12 w-screen'>
        <button
          onClick={toggleSidebar}
          className=' bg-white  p-1.5 m-1.5 cursor-pointer   shadow-sm rounded-sm w-fit'
        >
          {open ? <XIcon className='h-5' /> : <PanelLeft className='h-5' />}
        </button>

        <p className={`absolute font-semibold top-3 ${open ? 'left-64 ml-10' : 'left-16 ml-2'}`}> {tenantName}</p>
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
