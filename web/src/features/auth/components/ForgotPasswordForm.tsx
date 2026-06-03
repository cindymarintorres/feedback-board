import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { AppButton, AppInput } from "@/components/shared";
import { ForgotPasswordFormSchema, type ForgotPasswordFormData } from '@/features/auth/schemas/auth.schema'
import { toast } from "sonner";
import { usePasswordReset } from "@/hooks/usePasswordReset";

export const ForgotPasswordForm = () => {

const { forgotPasswordMutation } = usePasswordReset();
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    mode: "onBlur",
  });
 
  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Si el correo existe, recibirás un email con las instrucciones");
        reset();
      },
      onError: () => {
        toast.error("Ocurrió un error, intenta de nuevo");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppInput
        id="email"
        label="Email"
        type="email"
        placeholder="tu@email.com"
        leftIcon={Mail}
        error={errors.email?.message}
        {...register("email")}
      />

      <AppButton
        type="submit"
        className="w-full"
        loadingText="Enviando..."
        leftIcon={Send}
      >
        Enviar correo
      </AppButton>
    </form>
  );
};