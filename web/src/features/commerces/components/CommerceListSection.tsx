import { AppButton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Store } from "lucide-react";
import { useState } from "react";
import { AddCommerceDialog } from "./AddCommerceDialog";
import { Separator } from "@/components/ui/separator";

export function CommerceListSection() {
  const { state } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
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
    <>
    <Card className="px-4">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold font-si">Mis comercios</CardTitle>
        <AppButton type="button" leftIcon={Plus} onClick={() => setDialogOpen(true)}>
          Agregar comercio
        </AppButton>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
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
            <Badge variant={com.verified ? "default" : "secondary"} className="leading-0">
              {com.verified ? "Verificado" : "Pendiente"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
    <AddCommerceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
