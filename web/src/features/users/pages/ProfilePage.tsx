import { useLocation } from "react-router";
import { ProfileSidebar } from "@/components/layout/settings/ProfileSidebar";
import { ProfileForm } from "../components/ProfileForm";
import { ContactForm } from "../components/ContactForm";
import { SocialLinksForm } from "../components/SocialLinksForm";
import { SecurityForm } from "../components/SecurityForm";
import { useAuth } from "@/hooks/useAuth";
import { CommerceListSection } from "@/features/commerces/components/CommerceListSection";

export function ProfilePage() {
  const { state } = useAuth();
  const user = state.user!;
  const { hash } = useLocation();
  const activeSection = hash || "#personal";

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra tus preferencias e información personal
        </p>
      </div>

      {/* ── Layout: sidebar + contenido ────────────────────────────────────── */}
      <div className="flex gap-8 items-start">
        {/* Sidebar */}
        <ProfileSidebar />

        {/* Contenido según sección activa */}
        <div className="flex-1 min-w-0">
          {activeSection === "#personal" && <ProfileForm />}
          {activeSection === "#contact" && <ContactForm />}
          {activeSection === "#security" && <SecurityForm />}
          {activeSection === "#social" && <SocialLinksForm />}
          {activeSection === "#commerce" && user.role === "COMMERCE_ADMIN" && (
            <CommerceListSection commerces={user.commerce} />
          )}
          {/* {activeSection === "#preferences" && (
            <section className="rounded-xl border bg-card p-6">
              <h2 className="text-base font-semibold">Preferences</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Proximamente
              </p>
            </section>
          )} */}
        </div>
      </div>
    </div>
  );
}
