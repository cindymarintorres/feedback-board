import { Link } from "react-router"
import { RegisterForm } from "@/features/auth/components/RegisterForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterPage() { 
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex flex-row gap-4 justify-center mb-2 items-center">
          <img src="/public/feedback-loop.png" alt="Logo" className="w-15 h-15" />
          <CardTitle className="text-xl md:text-2xl text-primary">Feedback Board</CardTitle>
        </div>
        <CardDescription className="font-semibold text-xl">Crea una cuenta</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm /> 
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
  )
}