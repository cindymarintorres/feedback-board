import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import {
  ResetPasswordFormSchema,
  type ResetPasswordFormData,
} from "@/features/auth/schemas/auth.schema";
import { AppInput, AppButton} from "@/components/shared";
import { usePasswordReset } from "@/features/auth/hooks/usePasswordReset";


export const PasswordResetForm = ({ token }: { token: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { resetPasswordMutation } = usePasswordReset(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    reset,
    control,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    if (getValues("confirmPassword")) {
      trigger("confirmPassword");
    }
  }, [password, trigger, getValues]);

  // ─── Submit ──────────────────────────────────────────────────────

  const onSubmit = async (data: ResetPasswordFormData) => {
    await resetPasswordMutation.mutateAsync(
      { token, password: data.password },
      {
        onSuccess: () => {
          reset();
          toast.success("Contraseña restablecida. Redirigiendo al login...");
        },
        onError: () => {
          toast.error("El enlace expiró o es inválido. Solicita uno nuevo.");
        },
      },
    );
  };

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppInput
        id="password"
        label="Nueva contraseña"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        leftIcon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword((pass) => !pass)}
        error={errors.password?.message}
        {...register("password")}
      />
      <AppInput
        id="confirmPassword"
        label="Confirmar contraseña"
        type={showConfirm ? "text" : "password"}
        placeholder="••••••••"
        leftIcon={Lock}
        rightIcon={showConfirm ? Eye : EyeOff}
        onRightIconClick={() => setShowConfirm((pass) => !pass)}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <AppButton
        type="submit"
        className="w-full"
        isLoading={resetPasswordMutation.isPending}
        loadingText="Guardando..."
        leftIcon={RefreshCcw}
      >
        Restablecer contraseña
      </AppButton>
    </form>
  );
};
