import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppButton } from "@/components/shared";
import { KeyRound, UserX } from "lucide-react";
import { usersService } from "@/services/usersService";
import type { PublicUser } from "feedbackboard-shared";
import { ResetPasswordDialog } from "../components/ResetPasswordDialog";
import { DeactivateUserDialog } from "../components/DeactivateUserDialog";
import { useAuth } from "@/hooks/useAuth";

export function UsersPage() {
  const { state } = useAuth();
  const [resetTarget, setResetTarget] = useState<PublicUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<PublicUser | null>(null);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.findAll(),
  });

  const users = usersQuery.data ?? [];

  return (
    <>
      <Card className="px-2">
        <CardHeader className="px-2">
          <CardTitle className="text-lg font-semibold">Usuarios</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-3 px-2">
          {usersQuery.isLoading && (
            <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
          )}
          {!usersQuery.isLoading && users.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay usuarios registrados.</p>
          )}
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border p-3 flex items-center justify-between flex-wrap gap-2"
            >
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <AppButton
                  type="button"
                  leftIcon={KeyRound}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3"
                  onClick={() => setResetTarget(user)}
                  title="Resetear contraseña"
                />

                {user.id !== state.user?.id && (
                  <AppButton
                    type="button"
                    leftIcon={UserX}
                    className="bg-destructive text-white hover:bg-destructive/90 px-3"
                    onClick={() => setDeactivateTarget(user)}
                    title="Desactivar"
                  />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ResetPasswordDialog
        user={resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
      />
      <DeactivateUserDialog
        user={deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
      />
    </>
  );
}