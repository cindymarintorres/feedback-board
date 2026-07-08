import { Link, useLocation } from "react-router";
import { User, Mail, Link2, UserKey, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function ProfileSidebar() {
  const { hash } = useLocation();
  const activeHash = hash || "#personal";
  const { state } = useAuth();
  const user = state.user!;

  const sections = [
    { label: "Personal", icon: User, hash: "#personal" },
    { label: "Seguridad", icon: UserKey, hash: "#security" },
    { label: "Contacto", icon: Mail, hash: "#contact" },
    { label: "Redes Sociales", icon: Link2, hash: "#social" },
    ...(user.role === "COMMERCE_ADMIN"
      ? [{ label: "Comercio", icon: Store, hash: "#commerce" }]
      : []),
  ];

  return (
    <aside className="w-52 shrink-0">
      <nav className="flex flex-col gap-1 w-full">
        {sections.map(({ label, icon: Icon, hash: sectionHash }) => (
          <Link
            key={sectionHash}
            to={sectionHash}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeHash === sectionHash
                ? "bg-sidebar-accent text-accent-foreground"
                : "text-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
