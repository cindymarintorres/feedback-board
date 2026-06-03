import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Globe, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AppInput, AppButton } from "@/components/shared";
import {
  ContactFormSchema,
  type ContactFormData,
} from "../schemas/user-settings.schema";
import { toast } from "sonner";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useAuth } from "@/hooks/useAuth";

export function ContactForm() {
  const { state } = useAuth();
  const user = state.user!;
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    values: { phone: user.phone ?? "", location: user.location ?? "", website: user.website ?? "" },
    mode: "onBlur",
  });

  //PATCH /users/:id
  const onSave = async (data: ContactFormData) => {
    await updateUser.mutateAsync(data, {
      onSuccess: () => toast.success("Contactos actualizados correctamente"),
      onError: () => toast.error("Error al actualizar el contacto"),
    });
  };
  return (
    <section id="contact" className="rounded-xl border bg-card p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold">Información de contacto</h2>
        <p className="text-sm text-muted-foreground">
          ¿Cómo pueden contactarte?
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {/* Email — solo lectura, se cambia desde Personal Info */}
        <AppInput
          id="contactEmail"
          label="Correo"
          type="email"
          value={user.email}
          leftIcon={Mail}
          disabled
          readOnly
        />

        <AppInput
          id="phone"
          label="Número telefónico"
          placeholder="+1 (555) 123-4567"
          leftIcon={Phone}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <AppInput
          id="location"
          label="Ubicación"
          placeholder="San Francisco, CA"
          leftIcon={MapPin}
          error={errors.location?.message}
          {...register("location")}
        />

        <AppInput
          id="website"
          label="Sitio web"
          placeholder="https://yoursite.com"
          leftIcon={Globe}
          error={errors.website?.message}
          {...register("website")}
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
