import * as React from 'react';
import { Frame, LayoutDashboard, Map, PartyPopperIcon, PieChart, Settings2, UserIcon, UsersIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

export function TenantSidebar() {
  const params = useLocation();

  const navigate = useNavigate();

  const data = {
    navMain: [
      {
        title: 'Home',
        url: '#',
        icon: LayoutDashboard,
        isActive: true,
        isDropdown: true,
      },
      {
        title: 'Users',
        url: '?view=users',
        icon: UsersIcon,
      },
      {
        title: 'Events',
        url: '?view=events',
        icon: PartyPopperIcon,
      },
      {
        title: 'Profile',
        url: '?view=profile',
        icon: UserIcon,
      },
      {
        title: 'Billing',
        url: '?view=billing',
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

  const handleNavigation = (url) => {

    if (url === params.pathname) return;

    if (url === '#') {
      navigate(params.pathname);
      return;
    }
    navigate(`${params.pathname}${url}`, { replace: true });
  };

  return (
    <SidebarProvider className='items-start z-50 w-fit'>
      <Sidebar
        collapsible='none'
        className='hidden md:flex'
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item, index) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === (params.search !== '' ? params.search : params.pathname)}
                    >
                      {/* Handle navigation with handleNavigation */}
                      <button
                        onClick={() => {
                          handleNavigation(item.url);
                        }}
                        className={`flex items-center 
                          ${
                            (params.search !== '' ? params.search : params.pathname).includes(item.url)
                              ? '!border-l-2 !font-semibold border-black rounded-l-none'
                              : ''
                          }
                          ${
                            params.search === '' &&
                            index === 0 &&
                            '!border-l-2 !font-semibold border-black rounded-l-none'
                          }
                          `}
                      >
                        <item.icon />

                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
