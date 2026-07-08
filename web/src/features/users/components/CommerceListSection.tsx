import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Store } from "lucide-react";

export function CommerceListSection() {
  const { state } = useAuth();
  const user = state.user;

  if (!user || user.role !== "COMMERCE_ADMIN") return null;

  const commerces = user.commerce;

  if (commerces.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Aún no tienes comercios registrados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Mis comercios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {commerces.map((com) => (
          <div
            key={com.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{com.name}</p>
                <p className="text-xs text-muted-foreground">/{com.slug}</p>
              </div>
            </div>
            <Badge variant={com.verified ? "default" : "secondary"}>
              {com.verified ? "Verificado" : "Pendiente"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
