import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AppInput, AppButton } from "@/components/shared";
import {
  SocialLinksFormSchema,
  type SocialLinksFormData,
} from "../schemas/user-settings.schema";
import { useUpdateUser } from "@/features/auth/hooks/useUpdateUser";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function SocialLinksForm() {
  const { state } = useAuth();
  const user = state.user!;
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinksFormData>({
    resolver: zodResolver(SocialLinksFormSchema),
    values: {
      twitterHandle: user.twitterHandle ?? "",
      linkedinHandle: user.linkedinHandle ?? "",
      githubHandle: user.githubHandle ?? "",
    },
  });

  //PATCH /users/:id
  const onSave = async (data: SocialLinksFormData) => {
    await updateUser.mutateAsync(data, {
      onSuccess: () => toast.success("Redes sociales actualizadas correctamente"),
      onError: () => toast.error("Error al actualizar las redes sociales"),
    });
  };

  return (
    <section id="social" className="rounded-xl border bg-card p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold">Redes Sociales</h2>
        <p className="text-sm text-muted-foreground">
          Conecta tus cuentas de redes sociales
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {/* Twitter / X */}
        <AppInput
          id="twitterHandle"
          label="Twitter / X"
          placeholder="x.com/yourhandle"
          leftIcon={Link2}
          error={errors.twitterHandle?.message}
          {...register("twitterHandle")}
        />

        {/* LinkedIn */}
        <AppInput
          id="linkedinHandle"
          label="LinkedIn"
          placeholder="linkedin.com/in/yourhandle"
          leftIcon={Link2}
          error={errors.linkedinHandle?.message}
          {...register("linkedinHandle")}
        />

        {/* GitHub */}
        <AppInput
          id="githubHandle"
          label="GitHub"
          placeholder="github.com/yourhandle"
          leftIcon={Link2}
          error={errors.githubHandle?.message}
          {...register("githubHandle")}
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
    </section>
  );
}
