import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Camera, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AppInput, AppButton, AppTextarea } from "@/components/shared";
import {
  ProfileFormSchema,
  type ProfileFormData,
} from "../schemas/user-settings.schema";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useUpdateUser } from "@/features/auth/hooks/useUpdateUser";

export function ProfileForm() {
  const { state } = useAuth();
  const user = state.user!;
  const updateUser = useUpdateUser();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // ── Profile ────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit: handleProfile,
    formState: { errors, isSubmitting: savingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    values: { name: user.name, avatarUrl: user.avatarUrl ?? "", bio: user.bio ?? "" },
    mode: "onBlur",
  });
  
  //PATCH /users/:id
  //DEBUG: forzar error para ver el toast rojo — borrar cuando ya funcione
  /*const onProfileSave = async (_data: ProfileFormData) => {
    toast.warning("Error al actualizar el perfil");
  };*/

  const onProfileSave = async (data: ProfileFormData) => {
    await updateUser.mutateAsync(data, {
      onSuccess: () => toast.success("Perfil actualizado correctamente"),
      onError: () => toast.error("Error al actualizar el perfil"),
    });
  };

  return (
    <div className="space-y-8">
      {/* ── Información personal ────────────────────────────────────────────── */}
      <section
        id="personal"
        className="rounded-xl border bg-card p-6 space-y-6"
      >
        <div>
          <h2 className="text-base font-semibold">Información Personal</h2>
          <p className="text-sm text-muted-foreground">
            Actualiza tu foto y detalles personales
          </p>
        </div>

        <Separator />

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-not-allowed">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Foto</p>
            <p className="text-xs text-muted-foreground">
              Ingresa una url de imagen o deja vacio el campo
            </p>
          </div>
        </div>

        <form onSubmit={handleProfile(onProfileSave)} className="space-y-4">
          <AppInput
            id="avatarUrl"
            label="URL Foto (Avatar)"
            placeholder="https://example.com/photo.jpg"
            leftIcon={Camera}
            error={errors.avatarUrl?.message}
            {...register("avatarUrl")}
          />
          <AppInput
            id="name"
            label="Nombres"
            placeholder="Your name"
            leftIcon={User}
            error={errors.name?.message}
            {...register("name")}
          />
          <AppTextarea
            id="bio"
            label="Autobiografia"
            placeholder="Cuentanos sobre ti..."
            rows={3}
            hint="Max 160 characters"
            error={errors.bio?.message}
            {...register("bio")}
          />
          <div className="flex justify-end">
            <AppButton
              type="submit"
              isLoading={savingProfile}
              loadingText="Saving..."
              leftIcon={Save}
            >
              Guardar
            </AppButton>
          </div>
        </form>
      </section>
    </div>
  );
}
