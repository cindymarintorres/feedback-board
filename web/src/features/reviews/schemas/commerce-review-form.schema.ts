import { z } from "zod";
import { CreateCommerceReviewSchema } from "feedbackboard-shared";

// Reutiliza el schema compartido, quitando commerceId (lo inyectamos nosotros
// desde el comercio ya resuelto, no lo llena el usuario) — composición vía
// .omit(), no un schema paralelo.
export const ReviewFormSchema = CreateCommerceReviewSchema.omit({
  commerceId: true,
});

export type ReviewFormValues = z.infer<typeof ReviewFormSchema>;