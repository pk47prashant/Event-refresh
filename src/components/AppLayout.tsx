import { Outlet } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Mail,
  ClipboardList,
  ListChecks,
  Globe,
  ChevronDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
const menuItems = [
  {
    title: 'Event Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Templates',
    icon: FileText,
    subItems: [
      { title: 'Registration', url: '/templates/registration', icon: ClipboardList },
      { title: 'Email', url: '/templates/email', icon: Mail },
      { title: 'Survey', url: '/templates/survey', icon: ListChecks },
    ],
  },
  {
    title: 'Website Builder',
    url: '/website-builder',
    icon: Globe,
  },
];

function SidebarMenuContent() {
  const location = useLocation();

  const isTemplatesActive = ['/templates/registration', '/templates/email', '/templates/survey'].some(
    (path) => location.pathname === path
  );

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        if (item.subItems) {
          return (
            <SidebarMenuItem key={item.title}>
              <Collapsible defaultOpen={isTemplatesActive} className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={isTemplatesActive}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.url}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === subItem.url}
                        >
                          <NavLink to={subItem.url}>
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title} isActive={location.pathname === item.url}>
              <NavLink to={item.url}>
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function MainContent() {
  const { state } = useSidebar();

  return (
    <SidebarInset>
      {/* Expand trigger - visible when sidebar is collapsed */}
      {state === 'collapsed' && (
        <div className="fixed left-0 top-4 z-50 pl-2">
          <SidebarTrigger
            className="h-9 w-9 rounded-md border border-border bg-background shadow-sm hover:bg-muted"
            title="Expand sidebar"
          />
        </div>
      )}
      <Outlet />
    </SidebarInset>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <SidebarTrigger className="-ml-1" />
            <span className="font-semibold text-sidebar-foreground">Event App</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuContent />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <MainContent />
    </SidebarProvider>
  );
}
