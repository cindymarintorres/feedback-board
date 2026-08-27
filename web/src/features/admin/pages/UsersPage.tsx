import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppButton, AppInput } from "@/components/shared";
import { KeyRound, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { usersService } from "@/services/usersService";
import type { PublicUser } from "feedbackboard-shared";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { useUserActions } from "../hooks/useUserActions";

export function UsersPage() {
  const { state } = useAuth();
  const [resetTarget, setResetTarget] = useState<PublicUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<PublicUser | null>(
    null,
  );
  const [activateTarget, setActivateTarget] = useState<PublicUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PublicUser | null>(null);
  const {
    resetPasswordMutation,
    deactivateMutation,
    activateMutation,
    removeMutation,
  } = useUserActions();

  const [search, setSearch] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.findAll(),
  });

  const users = usersQuery.data ?? [];
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Card className="px-2">
        <CardHeader className="px-2 flex flex-1 flex-col md:flex-row items-center md:justify-between">
          <CardTitle className="text-lg font-semibold">Usuarios</CardTitle>
            <AppInput
              id="input-search"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={Search}
              className="md:w-80"
            />
          
        </CardHeader>

        <Separator />

        <CardContent className="space-y-3 px-2">
          {usersQuery.isLoading && (
            <p className="text-sm text-muted-foreground">
              Cargando usuarios...
            </p>
          )}
          {!usersQuery.isLoading && users.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay usuarios registrados.
            </p>
          )}
          {filteredUsers.map((user) => (
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
                {user.isActive ? (
                  <>
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
                        className="bg-destructive/20 text-destructive hover:bg-destructive/30 px-3"
                        onClick={() => setDeactivateTarget(user)}
                        title="Desactivar"
                      />
                    )}
                  </>
                ) : (
                  <AppButton
                    type="button"
                    leftIcon={UserCheck}
                    className="bg-green-100 text-green-800 hover:bg-green-200/80 px-3"
                    onClick={() => setActivateTarget(user)}
                    title="Reactivar"
                  />
                )}

                {user.id !== state.user?.id && (
                  <AppButton
                    type="button"
                    leftIcon={Trash2}
                    className="bg-destructive text-white hover:bg-destructive/90 px-3"
                    onClick={() => setDeleteTarget(user)}
                    title="Eliminar"
                  />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ConfirmActionDialog
        user={resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
        title="Resetear contraseña"
        description={(u) => (
          <>
            Se generará una contraseña temporal para <strong>{u.name}</strong> y
            se enviará por correo a <strong>{u.email}</strong>. El usuario
            deberá cambiarla al ingresar.
          </>
        )}
        confirmLabel="Sí, resetear"
        loadingText="Enviando..."
        successMessage="Se generó una contraseña temporal y se envió por correo"
        tone="success"
        errorMessage="No se pudo resetear la contraseña"
        mutation={resetPasswordMutation}
      />
      <ConfirmActionDialog
        user={deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Desactivar usuario"
        description={(u) => (
          <>
            Vas a desactivar a <strong>{u.name}</strong>. No podrá iniciar
            sesión hasta que se reactive su cuenta.
          </>
        )}
        confirmLabel="Sí, desactivar"
        loadingText="Desactivando..."
        successMessage="Usuario desactivado correctamente"
        errorMessage="No se pudo desactivar el usuario"
        tone="destructive"
        mutation={deactivateMutation}
      />
      <ConfirmActionDialog
        user={activateTarget}
        onOpenChange={(open) => !open && setActivateTarget(null)}
        title="Reactivar usuario"
        description={(u) => (
          <>
            Vas a reactivar a <strong>{u.name}</strong>. Va a poder iniciar
            sesión normalmente de nuevo.
          </>
        )}
        confirmLabel="Sí, reactivar"
        loadingText="Reactivando..."
        successMessage="Usuario reactivado correctamente"
        tone="success"
        errorMessage="No se pudo reactivar el usuario"
        mutation={activateMutation}
      />
      <ConfirmActionDialog
        user={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar usuario"
        description={(u) => (
          <>
            Vas a eliminar <strong>{u.name}</strong> de forma permanente. Esta
            acción no se puede deshacer — a diferencia de desactivar, el
            registro se borra por completo.
          </>
        )}
        confirmLabel="Sí, eliminar"
        loadingText="Eliminando..."
        successMessage="Usuario eliminado correctamente"
        errorMessage="No se pudo eliminar el usuario"
        tone="destructive"
        mutation={removeMutation}
      />
    </>
  );
}
