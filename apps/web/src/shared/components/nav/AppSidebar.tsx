'use client';

import * as React from 'react';

import { authClient } from '@/shared/lib/authClient';
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
import {
  StoreIcon,
  ShoppingBagIcon,
  DishIcon,
  PackageSearchIcon,
  MotorbikeIcon,
  ClockIcon,
} from '@hugeicons/core-free-icons';
import { Logo } from '../brand/Logo';
import { Link } from 'react-router-dom';

type UserRole = 'customer' | 'vendor' | 'rider';

const navData: Record<UserRole, { name: string; url: string; icon: React.ReactNode }[]> = {
  customer: [
    {
      name: 'Browse Stores',
      url: '/stores',
      icon: <HugeiconsIcon icon={StoreIcon} strokeWidth={2} />,
    },
    {
      name: 'My Orders',
      url: '/orders',
      icon: <HugeiconsIcon icon={ShoppingBagIcon} strokeWidth={2} />,
    },
  ],
  vendor: [
    {
      name: 'Store Profile',
      url: '/stores/me',
      icon: <HugeiconsIcon icon={StoreIcon} strokeWidth={2} />,
    },
    {
      name: 'Store Items',
      url: '/stores/me/items',
      icon: <HugeiconsIcon icon={DishIcon} strokeWidth={2} />,
    },
  ],
  rider: [
    {
      name: 'Explore Jobs',
      url: '/deliveries/jobs',
      icon: <HugeiconsIcon icon={PackageSearchIcon} strokeWidth={2} />,
    },
    {
      name: 'Active Deliveries',
      url: '/deliveries/active',
      icon: <HugeiconsIcon icon={MotorbikeIcon} strokeWidth={2} />,
    },
    {
      name: 'History',
      url: '/deliveries/history',
      icon: <HugeiconsIcon icon={ClockIcon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const role = session ? (session.user?.role as UserRole | undefined) || 'customer' : undefined;

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
        <NavMain navItems={role ? navData[role] : []} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
