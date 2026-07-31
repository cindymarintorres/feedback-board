import { AppButton } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Plus} from "lucide-react";
import { useState } from "react";
import { AddCommerceDialog } from "./AddCommerceDialog";
import { Separator } from "@/components/ui/separator";
import type { AddCommerceResponseDto } from "feedbackboard-shared";
import { DeleteCommerceDialog } from "./DeleteCommerceDialog";
import { CommerceCard } from "./CommerceCard";

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
            <CommerceCard
              key={com.id}
              commerce={com}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
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
