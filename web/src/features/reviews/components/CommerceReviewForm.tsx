import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySchema } from "feedbackboard-shared";
import type { CreateCommerceReviewDto } from "feedbackboard-shared";
import { ReviewFormSchema } from "../schemas/commerce-review-form.schema";
import type { ReviewFormValues } from "../schemas/commerce-review-form.schema";
import { useCommerceReviewActions } from "../hooks/useCommerceReviewActions";
import { AppButton } from "@/components/shared";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CommerceReviewFormProps {
  commerceId: string;
  onSuccess: () => void;
}

export function CommerceReviewForm({
  commerceId,
  onSuccess,
}: CommerceReviewFormProps) {
  const { createReviewMutation } = useCommerceReviewActions();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { stars: 0, category: undefined, comment: "" },
  });

  const onSubmit = (values: ReviewFormValues) => {
    const payload: CreateCommerceReviewDto = { ...values, commerceId };

    createReviewMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("¡Gracias por tu reseña!");
        onSuccess();
      },
      onError: (error: unknown) => {
        toast.error("No pudimos enviar tu reseña. Intentá de nuevo.");
        console.error("Create review failed:", error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="stars"
        render={({ field }) => (
          <div className="flex justify-center">
            <StarRating value={field.value} onChange={field.onChange} size={28} />
          </div>
        )}
      />
      {errors.stars && (
        <p className="text-sm text-destructive text-center">
          {errors.stars.message}
        </p>
      )}

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {CategorySchema.options.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Textarea placeholder="Comentario (opcional)" {...register("comment")} />

      <AppButton
        type="submit"
        className="w-full"
        disabled={createReviewMutation.isPending}
      >
        {createReviewMutation.isPending ? "Enviando..." : "Enviar reseña"}
      </AppButton>
    </form>
  );
}