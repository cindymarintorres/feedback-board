import { RegisterCommerceForm } from "@/features/commerces/components/RegisterCommerceForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router"
import { ArrowLeft } from "lucide-react"

export function RegisterCommercePage() {
  return (
    <Card className="w-full my-10">
      <CardHeader className="text-center">
        
        <div className="flex flex-row gap-4 justify-center mb-2 items-center">
          <img src="/public/feedback-loop.png" alt="Logo" className="w-15 h-15" />
          <CardTitle className="text-xl md:text-2xl text-primary">Feedback Board</CardTitle>
        </div>
        <CardDescription className="font-semibold text-xl">Registra tu comercio</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterCommerceForm />
        <div className="text-center p-3 font-medium">
          <p className="text-sm text-muted-foreground">
            <Link to="/getting-started" className="text-primary hover:underline text-center flex justify-center gap-1 items-center">
              <ArrowLeft className="size-4" />
              Volver a selección
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}