import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "feedbackboard-shared";

type Props = {
  allowedRoles: UserRole[];
};

export const RoleGuard = ({ allowedRoles }: Props) => {
  const {
    state: { user },
  } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/board" replace />
  );
};

