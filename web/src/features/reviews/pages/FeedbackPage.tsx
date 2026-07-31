import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { commerceService } from "@/services/commerceService";
import { AppButton, FullscreenSpinner } from "@/components/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CommerceReviewForm } from "../components/CommerceReviewForm";

export function FeedbackPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();

  const commerceQuery = useQuery({
    queryKey: ["commerce-by-slug", slug],
    queryFn: () => commerceService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (commerceQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  if (commerceQuery.isError || !commerceQuery.data) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comercio no encontrado</DialogTitle>
            <DialogDescription>
              No pudimos encontrar este comercio. Verifica que el enlace sea
              correcto o contacta al comercio para que te reenvíe el link.
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

  const commerce = commerceQuery.data;

  if (!state.isAuthenticated) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información</DialogTitle>
            <DialogDescription>
              Para enviar una reseña o voto a <strong>{commerce.name}</strong>, debes iniciar sesión.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AppButton type="button" onClick={() => navigate("/login", { state: { from: location.pathname } })}>
              Ir a iniciar sesión
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (state.user?.role !== "MEMBER") {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información</DialogTitle>
            <DialogDescription>
              Solo los usuarios miembros pueden dejar reseñas.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold">{commerce.name}</CardTitle>
          <CardDescription>Califícanos y cuéntanos tu experiencia</CardDescription>
        </CardHeader>
        <CardContent>
          <CommerceReviewForm
            commerceId={commerce.id}
            onSuccess={() => navigate("/board")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
