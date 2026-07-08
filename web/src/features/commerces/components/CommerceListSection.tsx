import { AppButton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Plus, Store, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddCommerceDialog } from "./AddCommerceDialog";
import { Separator } from "@/components/ui/separator";
import type { AddCommerceResponseDto } from "feedbackboard-shared";
import { DeleteCommerceDialog } from "./DeleteCommerceDialog";

export function CommerceListSection() {
  const { state } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCommerce, setEditingCommerce] =
    useState<AddCommerceResponseDto | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<AddCommerceResponseDto | null>(null);
  const user = state.user;

  if (!user || user.role !== "COMMERCE_ADMIN") return null;

  const commerces = user.commerce;

  const openCreate = () => {
    setEditingCommerce(null);
    setDialogOpen(true);
  };

  const openEdit = (commerce: AddCommerceResponseDto) => {
    setEditingCommerce(commerce);
    setDialogOpen(true);
  };

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
      <Card className="px-2">
        <CardHeader className="flex flex-row justify-between items-center px-2">
          <CardTitle className="text-lg font-semibold font-si">
            Mis comercios
          </CardTitle>
          <AppButton type="button" leftIcon={Plus} onClick={openCreate}>
            Agregar comercio
          </AppButton>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-3 max-h-80 overflow-y-auto px-2">
          {commerces.map((com) => (
            <div key={com.id} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{com.name}</p>
                    <p className="text-xs text-muted-foreground">/{com.slug}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge
                    variant={com.verified ? "default" : "secondary"}
                    className="leading-0 w-full"
                  >
                    {com.verified ? "Verificado" : "Pendiente"}
                  </Badge>
                  {com.verified && (
                    <div className="flex flex-row gap-2">
                      <AppButton
                        type="button"
                        leftIcon={Pencil}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3"
                        onClick={() => openEdit(com)}
                        title="Editar"
                      />
                      <AppButton
                        type="button"
                        leftIcon={Trash2}
                        className="bg-destructive text-white hover:bg-destructive/90 px-3"
                        onClick={() => setDeleteTarget(com)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <AddCommerceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCommerce={editingCommerce}
      />
      <DeleteCommerceDialog
        commerce={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </>
  );
}
