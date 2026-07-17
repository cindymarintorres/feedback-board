import { useMutation, useQuery } from "@tanstack/react-query";
import { commerceReviewService } from "@/services/commerceReviewService";
import type {
  CreateCommerceReviewDto,
  CommerceReviewResponseDto,
  Order,
  UserRole,
} from "feedbackboard-shared";

interface UseCommerceReviewActionsParams {
  role?: UserRole;
  commerceId?: string;
  ownerId?: string;
  order?: Order;
}

export const useCommerceReviewActions = ({
  role,
  commerceId,
  ownerId,
  order = "newest",
}: UseCommerceReviewActionsParams = {}) => {
  const isEnabled =
    role === "MEMBER" ||
    (role === "COMMERCE_ADMIN" && !!commerceId) ||
    (role === "ADMIN" && !!ownerId);

  const reviewsQuery = useQuery<CommerceReviewResponseDto[]>({
    queryKey: ["commerce-reviews", role, commerceId, ownerId, order],
    queryFn: () =>
      commerceReviewService.findReviews({ commerceId, ownerId, order }),
    enabled: isEnabled,
  });

  const createReviewMutation = useMutation({
    mutationFn: (payload: CreateCommerceReviewDto) =>
      commerceReviewService.create(payload),
  });

  return { reviewsQuery, createReviewMutation };
};