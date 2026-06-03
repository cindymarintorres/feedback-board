import { LayoutDashboard, Shield } from "lucide-react";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router";

const navItems = [{ title: "Board", url: "/board", icon: LayoutDashboard }];

const adminItems = [{ title: "Admin", url: "/admin", icon: Shield }];

export function AppSidebar() {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "ADMIN";

  return (
    <Sidebar collapsible="icon">
      {/* Header — Logo */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img
            src="/feedback-loop.png"
            alt="FeedbackBoard"
            className="h-10 w-10"
          />
          <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
            FeedbackBoard
          </span>
        </div>
      </SidebarHeader>

      {/* Nav principal */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* Nuevo patrón con shadcn v4 + base-ui para componentes que usaban el prop "asChild", ahora se usa "render" */}
                  <SidebarMenuButton
                    render={<Link to={item.url} className=""/>}
                    isActive={location.pathname === item.url}
                    className="gap-2 text-accent-foreground hover:text-bolder hover:bg-sidebar-accent hover:text-accent-foreground"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Solo visible para ADMIN */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {/* Nuevo patrón con shadcn v4 + base-ui para componentes que usaban el prop "asChild", ahora se usa "render" */}
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      isActive={location.pathname === item.url}
                      className="gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer — Usuario */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
