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

interface ResetPasswordDialogProps {
  user: PublicUser | null;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordDialog({ user, onOpenChange }: ResetPasswordDialogProps) {
  const { resetPasswordMutation } = useUserActions();

  const handleConfirm = async () => {
    if (!user) return;
    await resetPasswordMutation.mutateAsync(user.id, {
      onSuccess: () => {
        toast.success("Se generó una contraseña temporal y se envió por correo");
        onOpenChange(false);
      },
      onError: () => toast.error("No se pudo resetear la contraseña"),
    });
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resetear contraseña</DialogTitle>
          <DialogDescription>
            Se generará una contraseña temporal para <strong>{user?.name}</strong> y se
            enviará por correo a <strong>{user?.email}</strong>. El usuario deberá
            cambiarla al ingresar.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="py-2 flex flex-row justify-end">
          <AppButton type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </AppButton>
          <AppButton
            type="button"
            isLoading={resetPasswordMutation.isPending}
            loadingText="Enviando..."
            onClick={handleConfirm}
          >
            Sí, resetear
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}