import { LayoutDashboard, Star, Store, Users } from "lucide-react";
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
import type { UserRole } from "feedbackboard-shared";

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
}

// Board y Ratings los ve cualquier rol autenticado — se define una sola vez
// acá, y cada rol solo agrega lo que le suma por encima de esta base.
const BASE_NAV_ITEMS: NavItem[] = [
  { title: "Board", url: "/board", icon: LayoutDashboard },
  { title: "Ratings", url: "/ratings", icon: Star },
];

function getNavItemsForRole(role?: UserRole): NavItem[] {
  switch (role) {
    case "ADMIN":
      return [
        ...BASE_NAV_ITEMS,
        { title: "Comercios", url: "/commerces", icon: Store },
        { title: "Usuarios", url: "/users", icon: Users },
      ];
    case "COMMERCE_ADMIN":
      return [
        ...BASE_NAV_ITEMS,
        { title: "Comercios", url: "/commerces", icon: Store },
      ];
    case "MEMBER":
    default:
      return BASE_NAV_ITEMS;
  }
}

export function AppSidebar() {
  const { state } = useAuth();
  const location = useLocation();
  const navItems = getNavItemsForRole(state.user?.role);

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

      {/* Nav principal — misma lista para todos los roles, contenido distinto */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1">
                  <SidebarMenuButton
                    render={<Link to={item.url} className="" />}
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
      </SidebarContent>

      {/* Footer — Usuario */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
