import { Link } from "react-router";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function ForgotPasswordPage() {
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
          ¿Olvidaste tu contraseña?
        </CardDescription>
        <p className="text-sm text-muted-foreground">
          Ingresa tu email y te enviaremos un enlace para restablecerla.
        </p>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm />
        <div className="text-center p-3 font-medium">
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline text-center flex justify-center gap-1 items-center">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
