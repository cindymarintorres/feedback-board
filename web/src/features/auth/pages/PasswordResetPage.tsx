import { PasswordResetForm } from "@/features/auth/components/PasswordResetForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate, useSearchParams } from "react-router";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { AppButton, FullscreenSpinner } from "@/components/shared";

export function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? undefined;

  const { validateTokenQuery } = usePasswordReset(token);

  // ─── Early returns ────────────────────────────────────────────────
  if (validateTokenQuery.isLoading) return <FullscreenSpinner />;

  if (validateTokenQuery.isError || !token) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enlace inválido o expirado</DialogTitle>
            <DialogDescription>
              El enlace que usaste ya no es válido. Solicita uno nuevo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AppButton
              type="button"
              onClick={() => navigate("/forgot-password")}
            >
              Solicitar nuevo enlace
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Token válido — renderiza la página completa ──────────────────
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex flex-row gap-4 justify-center mb-2 items-center">
          <div className="rounded-lg p-2 flex items-center justify-center text-primary-foreground font-bold text-lg">
            <img
              src="/public/feedback-loop.png"
              alt="Logo"
              className="w-15 h-15"
            />
          </div>
          <CardTitle className="text-xl md:text-2xl text-primary">
            Feedback Board
          </CardTitle>
        </div>

        <CardDescription className="font-semibold text-xl">
          Restablecer contraseña
        </CardDescription>
        <p className="text-sm text-muted-foreground">
          Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
        </p>
      </CardHeader>

      <CardContent>
        <PasswordResetForm token={token} />
      </CardContent>
    </Card>
  );
}
