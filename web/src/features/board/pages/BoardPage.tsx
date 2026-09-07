import { useAuth } from "@/hooks/useAuth";
import { MemberBoardSection } from "../components/MemberBoardSection";
import { CommerceAdminBoardSection } from "../components/CommerceAdminBoardSection";
import { AdminBoardSection } from "../components/AdminBoardSection";

export function BoardPage() {
  const { state } = useAuth();
  const role = state.user?.role;

  if (role === "MEMBER") return <MemberBoardSection />;
  if (role === "COMMERCE_ADMIN") return <CommerceAdminBoardSection />;
  if (role === "ADMIN") return <AdminBoardSection />;

  return null;
}