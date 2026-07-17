import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { commerceService } from "@/services/commerceService";
import { AppButton } from "@/components/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (commerceQuery.isError || !commerceQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No pudimos encontrar este comercio.
      </div>
    );
  }

  const commerce = commerceQuery.data;

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>{commerce.name}</CardTitle>
            <CardDescription>
              Para enviar una reseña o voto, debes iniciar sesión.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppButton
              type="button"
              className="w-full"
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
            >
              Iniciar sesión
            </AppButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.user?.role !== "MEMBER") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-muted-foreground p-4">
        Solo los usuarios miembros pueden dejar reseñas.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{commerce.name}</CardTitle>
          <CardDescription>Contanos tu experiencia</CardDescription>
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