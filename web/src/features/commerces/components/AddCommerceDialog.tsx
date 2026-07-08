import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AppInput, AppTextarea, AppButton } from "@/components/shared";
import { useCommerceActions } from "@/features/commerces/hooks/useCommerceActions";
import { CreateOwnCommerceSchema, type CreateOwnCommerceDto } from "feedbackboard-shared";

interface AddCommerceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCommerceDialog({ open, onOpenChange }: AddCommerceDialogProps) {
  const { addCommerceMutation } = useCommerceActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOwnCommerceDto>({
    resolver: zodResolver(CreateOwnCommerceSchema),
  });

  const onSubmit = async (data: CreateOwnCommerceDto) => {
    await addCommerceMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Comercio agregado correctamente");
        reset();
        onOpenChange(false);
      },
      onError: () => toast.error("Error al agregar el comercio"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar comercio</DialogTitle>
          <DialogDescription>
            Este comercio quedará verificado automáticamente en tu cuenta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AppInput
            id="name"
            label="Nombre del comercio"
            leftIcon={Store}
            error={errors.name?.message}
            {...register("name")}
          />
          <AppTextarea
            id="description"
            label="Descripción (opcional)"
            rows={3}
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="flex justify-end">
            <AppButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Guardando..."
              leftIcon={Save}
            >
              Guardar
            </AppButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}