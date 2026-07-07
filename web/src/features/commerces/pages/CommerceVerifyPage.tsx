import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useCommerceActions } from "@/features/commerces/hooks/useCommerceActions";
import { useAuth } from "@/hooks/useAuth";
import { AppButton, FullscreenSpinner } from "@/components/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
export function CommerceVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const navigate = useNavigate();
  const { state } = useAuth();

  const { verifyCommerceQuery } = useCommerceActions(token);
const { isLoading, isSuccess, isError } = verifyCommerceQuery;

  useEffect(() => {
    // Espera a que la query de verificación Y el auth refresh inicial resuelvan
    if (!isSuccess || state.isLoading) return;
    const target = state.isAuthenticated ? "/board" : "/login";
    setTimeout(() => navigate(target), 1500);
  }, [isSuccess, state.isLoading, state.isAuthenticated, navigate]);

  if (isLoading || !token) return <FullscreenSpinner />;

  if (isError) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enlace inválido o expirado</DialogTitle>
            <DialogDescription>
              El enlace de verificación ya no es válido, expiró o ya fue
              utilizado. Contacta soporte para reenviar la verificación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AppButton type="button" onClick={() => navigate("/login")}>
              Ir a iniciar sesión
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comercio verificado</DialogTitle>
          <DialogDescription>
            Tu comercio fue verificado correctamente. Te redirigiremos en un
            momento...
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
