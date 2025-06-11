'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { GraduationCap } from 'lucide-react';

export function SidebarKnowledgeBase() {
  const pathname = usePathname();
  const isActive = pathname === '/knowledge-base';

  return (
    <div className="px-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip="Knowledge Base"
          >
            <Link href="/knowledge-base">
              <GraduationCap className="size-4" />
              <span>Knowledge Base</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
