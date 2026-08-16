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
import { useUserActions } from "../hooks/useUserActions";
import type { PublicUser } from "feedbackboard-shared";

interface DeactivateUserDialogProps {
  user: PublicUser | null;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateUserDialog({ user, onOpenChange }: DeactivateUserDialogProps) {
  const { deactivateMutation } = useUserActions();

  const handleConfirm = async () => {
    if (!user) return;
    await deactivateMutation.mutateAsync(user.id, {
      onSuccess: () => {
        toast.success("Usuario desactivado correctamente");
        onOpenChange(false);
      },
      onError: () => toast.error("No se pudo desactivar el usuario"),
    });
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar usuario</DialogTitle>
          <DialogDescription>
            Vas a desactivar a <strong>{user?.name}</strong>. No podrá iniciar sesión
            hasta que se reactive su cuenta.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="py-2 flex flex-row justify-end">
          <AppButton type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </AppButton>
          <AppButton
            type="button"
            isLoading={deactivateMutation.isPending}
            loadingText="Desactivando..."
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleConfirm}
          >
            Sí, desactivar
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}