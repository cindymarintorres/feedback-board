import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn } from "lucide-react";
import { AppButton, AppInput } from "@/components/shared";
import { useLogin } from "@/hooks/useLogin";
import { LoginSchema, type LoginFormData } from "@/features/auth/schemas/auth.schema";

export const LoginForm = () => {
  const { loginMutation } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppInput
        id="email"
        label="Email"
        type="email"
        showForgotPassword={true}  // <-- solo aquí
        placeholder="tu@email.com"
        leftIcon={Mail}
        error={errors.email?.message}
        {...register("email")}
      />

      <AppInput
        id="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        leftIcon={Lock}
        error={errors.password?.message}
        {...register("password")}
      />

      <AppButton
        type="submit"
        className="w-full"
        // isLoading={loginMutation.isPending}
        loadingText="Iniciando sesión..."
        leftIcon={LogIn}
      >
        Iniciar sesión
      </AppButton>

      {loginMutation.isError && (
        <p className="text-xs text-destructive text-center font-medium">
          Credenciales incorrectas. Intenta de nuevo.
        </p>
      )}
    </form>
  );
};
