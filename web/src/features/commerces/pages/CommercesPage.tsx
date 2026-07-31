import { useAuth } from "@/hooks/useAuth";
import { CommerceListSection } from "../components/CommerceListSection";
import { AdminCommercesSection } from "../components/AdminCommercesSection";

export function CommercesPage() {
  const { state } = useAuth();
  const role = state.user?.role;

  if (role === "COMMERCE_ADMIN") {
    return <CommerceListSection />;
  }

  if (role === "ADMIN") {
    return <AdminCommercesSection />;
  }

  return null;
}