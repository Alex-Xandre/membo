import * as React from 'react';
import {
  AppWindowIcon,
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PanelLeft,
  PieChart,
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
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/api/login.api';

// This is sample data.
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
      url: '#',
      icon: AppWindowIcon,
      isActive: true,
      isDropdown: true,
    },
    {
      title: 'Courses',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();
  const { dispatch } = useAuth();
  const nav = useNavigate();
  const onLogout = async () => {
    sessionStorage.removeItem('token');
    dispatch({ type: 'SIGNOUT' });
    logoutUser()
    nav('/');
  };

  return (
    <Sidebar
      collapsible='icon'
      {...props}
      className='!bg-red-900'
    >
      <button
        onClick={toggleSidebar}
        className='absolute -right-10 top-3 bg-white  p-1.5 cursor-pointer   shadow-sm rounded-sm w-fit'
      >
        {open ? <XIcon /> : <PanelLeft className='' />}
      </button>

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
