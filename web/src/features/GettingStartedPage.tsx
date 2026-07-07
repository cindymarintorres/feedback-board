import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { User, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppButton } from "@/components/shared";
import { cn } from "@/lib/utils";

type AccountType = "member" | "commerce";

export function GettingStartedPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AccountType | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    navigate(selected === "member" ? "/member/register" : "/commerce/register");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex flex-row gap-4 justify-center mb-2 items-center">
          <img src="/public/feedback-loop.png" alt="Logo" className="w-15 h-15" />
          <CardTitle className="text-xl md:text-2xl text-primary">Feedback Board</CardTitle>
        </div>
        <CardDescription className="font-semibold text-xl">
          ¿Cómo quieres registrarte?
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <button
          type="button"
          onClick={() => setSelected("member")}
          className={cn(
            "w-full flex items-start gap-3 rounded-lg border p-4 text-left transition-colors cursor-pointer",
            selected === "member"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <User className="mt-1 h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Soy usuario</p>
            <p className="text-sm text-muted-foreground">
              Quiero dar mi opinión y votar sugerencias en un comercio.
            </p>
          </div>
          <span
            className={cn(
              "mt-1 h-4 w-4 rounded-full border-2 shrink-0",
              selected === "member" ? "border-primary bg-primary" : "border-muted-foreground"
            )}
          />
        </button>

        <button
          type="button"
          onClick={() => setSelected("commerce")}
          className={cn(
            "w-full flex items-start gap-3 rounded-lg border p-4 text-left transition-colors cursor-pointer",
            selected === "commerce"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <Building2 className="mt-1 h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Soy un comercio</p>
            <p className="text-sm text-muted-foreground">
              Quiero recibir y gestionar sugerencias de mis usuarios.
            </p>
          </div>
          <span
            className={cn(
              "mt-1 h-4 w-4 rounded-full border-2 shrink-0",
              selected === "commerce" ? "border-primary bg-primary" : "border-muted-foreground"
            )}
          />
        </button>

        <AppButton
          type="button"
          className="w-full"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continuar
        </AppButton>

        <div className="text-center p-3 font-medium">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}