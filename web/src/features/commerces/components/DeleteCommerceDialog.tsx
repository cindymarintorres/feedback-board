import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AppButton } from "@/components/shared";
import { useCommerceActions } from "@/features/commerces/hooks/useCommerceActions";
import type { AddCommerceResponseDto } from "feedbackboard-shared";

interface DeleteCommerceDialogProps {
  commerce: AddCommerceResponseDto | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCommerceDialog({ commerce, onOpenChange }: DeleteCommerceDialogProps) {
  const { deleteCommerceMutation } = useCommerceActions();

  const handleConfirm = async () => {
    if (!commerce) return;
    await deleteCommerceMutation.mutateAsync(commerce.id, {
      onSuccess: () => {
        toast.success("Comercio eliminado correctamente");
        onOpenChange(false);
      },
      onError: () => toast.error("No se pudo eliminar el comercio"),
    });
  };

  return (
    <Dialog open={!!commerce} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar comercio</DialogTitle>
          <DialogDescription>
            Vas a eliminar <strong>{commerce?.name}</strong>. Esta acción no se puede deshacer
            y borrará también sus sugerencias asociadas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="py-2 flex flex-row justify-end">
          <AppButton type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </AppButton>
          <AppButton
            type="button"
            isLoading={deleteCommerceMutation.isPending}
            loadingText="Eliminando..."
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleConfirm}
          >
            Sí, eliminar
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}