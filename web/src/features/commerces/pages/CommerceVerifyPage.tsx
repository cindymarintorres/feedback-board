import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useCommerceActions } from "@/features/commerces/hooks/useCommerceActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CommerceVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const navigate = useNavigate();

  const { verifyCommerceQuery } = useCommerceActions(token);
  const { isLoading, isSuccess, isError, data } = verifyCommerceQuery;

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      setTimeout(() => navigate("/login"), 1500);
    }
    if (isError) {
      toast.error(
        "El enlace expiró o es inválido. Contacta soporte para reenviar la verificación.",
      );
    }
  }, [isSuccess, isError, data, navigate]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl md:text-2xl text-primary">
          Verificación de comercio
        </CardTitle>
        {isLoading && (
          <CardDescription>Verificando tu comercio...</CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {isSuccess && <p>{data.message} Redirigiendo al login...</p>}
        {isError && (
          <>
            <p className="text-destructive text-sm">
              No pudimos verificar tu comercio.
            </p>
            <Link to="/login" className="text-primary hover:underline">
              Ir a iniciar sesión
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
