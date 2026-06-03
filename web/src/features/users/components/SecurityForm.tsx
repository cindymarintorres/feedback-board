import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AppInput, AppButton } from "@/components/shared";
import {
  ChangePasswordFormSchema,
  type ChangePasswordFormData,
} from "../schemas/user-settings.schema";
import { useUpdatePassword } from "@/hooks/useUpdateUser";
import { toast } from "sonner";

export function SecurityForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const updatePassword = useUpdatePassword();

  // ── Password ───────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit: handlePassword,
    formState: { errors, isSubmitting: savingPassword },
    trigger,
    getValues,
    control,
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordFormSchema),
    mode: "onBlur",
  });

  // 2. Después watch, que depende de useForm
  const password = useWatch({ control, name: "newPassword" });

  // 3. Después useEffect, que depende de watch y trigger
  useEffect(() => {
    if (getValues("confirmPassword")) {
      trigger("confirmPassword");
    }
  }, [password, trigger, getValues]);

  //PATCH /users/:id/password
  const onPasswordSave = async (data: ChangePasswordFormData) => {
    await updatePassword.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Contraseña actualizada correctamente");
        resetPassword();
      },
      onError: () => toast.error("Error al cambiar la contraseña"),
    });
  };

  return (
    <div className="space-y-8">
      {/* ── Cambiar contraseña ──────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold">Cambiar contraseña</h2>
          <p className="text-sm text-muted-foreground">
            Ingresa tu nueva contraseña para actualizarla.
          </p>
        </div>

        <Separator />

        <form onSubmit={handlePassword(onPasswordSave)} className="space-y-4">
          <AppInput
            id="currentPassword"
            label="Contraseña actual"
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            leftIcon={Lock}
            rightIcon={showCurrent ? EyeOff : Eye}
            onRightIconClick={() => setShowCurrent((value) => !value)}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <AppInput
            id="newPassword"
            label="Nueva contraseña"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            leftIcon={Lock}
            rightIcon={showNew ? EyeOff : Eye}
            onRightIconClick={() => setShowNew((value) => !value)}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <AppInput
            id="confirmPassword"
            label="Confirmar nueva contraseña"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            leftIcon={Lock}
            rightIcon={showConfirm ? EyeOff : Eye}
            onRightIconClick={() => setShowConfirm((value) => !value)}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <div className="flex justify-end">
            <AppButton
              type="submit"
              isLoading={savingPassword}
              loadingText="Saving..."
              leftIcon={RefreshCcw}
            >
              Cambiar contraseña
            </AppButton>
          </div>
        </form>
      </section>
    </div>
  );
}
