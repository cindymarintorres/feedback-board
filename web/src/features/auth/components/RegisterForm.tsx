import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, UserPlus, EyeOff, Eye } from "lucide-react";
import { AppButton, AppInput } from "@/components/shared";
import { useRegister } from "@/hooks/useRegister";
import {
  RegisterFormSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/auth.schema";
import { useEffect, useState } from "react";

export const RegisterForm = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { registerMutation } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
    getValues
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  // 2. Después watch, que depende de useForm
  const password = useWatch({ control, name: "password" });

  // 3. Después useEffect, que depende de watch y trigger
  useEffect(() => {
    if (getValues("confirmPassword")) {
      trigger("confirmPassword");
    }
  }, [password, trigger, getValues]);

  const onSubmit = (data: RegisterFormData) => {
    // confirmPassword NO se manda — el hook recibe RegisterDto (name+email+password)
    const { confirmPassword, ...payload } = data;
    registerMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppInput
        id="name"
        label="Nombre completo"
        type="text"
        placeholder="John Doe"
        leftIcon={User}
        error={errors.name?.message}
        {...register("name")}
      />

      <AppInput
        id="email"
        label="Email"
        type="email"
        placeholder="tu@email.com"
        leftIcon={Mail}
        error={errors.email?.message}
        {...register("email")}
      />

      <AppInput
        id="password"
        label="Contraseña"
        type={showNew ? "text" : "password"}
        placeholder="••••••••"
        leftIcon={Lock}
        rightIcon={showNew ? EyeOff : Eye}
        onRightIconClick={() => setShowNew((value) => !value)}
        error={errors.password?.message}
        {...register("password")}
      />

      <AppInput
        id="confirmPassword"
        label="Confirmar contraseña"
        type={showConfirm ? "text" : "password"}
        placeholder="••••••••"
        leftIcon={Lock}
        rightIcon={showConfirm ? EyeOff : Eye}
        onRightIconClick={() => setShowConfirm((value) => !value)}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <AppButton
        type="submit"
        className="w-full"
        // isLoading={registerMutation.isPending}
        loadingText="Creando cuenta..."
        leftIcon={UserPlus}
      >
        Crear cuenta
      </AppButton>

      {registerMutation.isError && (
        <p className="text-xs text-destructive text-center font-medium">
          Error al crear la cuenta. Intenta de nuevo.
        </p>
      )}
    </form>
  );
};
