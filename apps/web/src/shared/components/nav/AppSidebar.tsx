'use client';

import * as React from 'react';

import { NavMain } from '@/shared/components/nav/NavMain';
import { NavUser } from '@/shared/components/nav/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import { StoreIcon } from '@hugeicons/core-free-icons';
import { Logo } from '../brand/Logo';
import { Link } from 'react-router-dom';

const data = {
  navMain: [
    {
      name: 'Stores',
      url: '/stores',
      icon: <HugeiconsIcon icon={StoreIcon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain navItems={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
