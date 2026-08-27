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
import type { UseMutationResult } from "@tanstack/react-query";
import type { PublicUser } from "feedbackboard-shared";
import type { ReactNode } from "react";
import { getErrorMessage } from "@/lib/errorMessage";

interface ConfirmActionDialogProps {
  user: PublicUser | null;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: (user: PublicUser) => ReactNode;
  confirmLabel: string;
  loadingText: string;
  successMessage: string;
  errorMessage: string;
  tone?: "destructive" | "success";
  mutation: UseMutationResult<{ success: boolean }, unknown, string>;
}

export function ConfirmActionDialog({
  user,
  onOpenChange,
  title,
  description,
  confirmLabel,
  loadingText,
  successMessage,
  errorMessage,
  tone,
  mutation,
}: ConfirmActionDialogProps) {
  const handleConfirm = async () => {
    if (!user) return;
    await mutation.mutateAsync(user.id, {
      onSuccess: () => {
        toast.success(successMessage);
        onOpenChange(false);
      },
      onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
    });
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{user && description(user)}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="py-2 flex flex-row justify-end">
          <AppButton type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </AppButton>
          <AppButton
            type="button"
            isLoading={mutation.isPending}
            loadingText={loadingText}
            className={
              tone === "destructive"
                ? "bg-destructive text-white hover:bg-destructive/90"
                : tone === "success"
                  ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
                  : undefined
            }
            onClick={handleConfirm}
          >
            {confirmLabel}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
