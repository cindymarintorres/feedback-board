import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCommerceReviewActions } from "@/features/reviews/hooks/useCommerceReviewActions";
import { StarRating } from "@/features/reviews/components/StarRating";
import { StatCard } from "./StatCard";
import type { CommerceReviewResponseDto } from "feedbackboard-shared";

const EMPTY_REVIEWS: CommerceReviewResponseDto[] = [];

export function MemberBoardSection() {
  const { state } = useAuth();
  const { reviewsQuery } = useCommerceReviewActions({ role: state.user?.role });
  const reviews: CommerceReviewResponseDto[] = reviewsQuery.data ?? EMPTY_REVIEWS;

  const summary = useMemo(() => {
    if (reviews.length === 0) return { total: 0, average: 0 };
    const total = reviews.length;
    const average = reviews.reduce((sum, r) => sum + r.stars, 0) / total;
    return { total, average };
  }, [reviews]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Mi actividad</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Reseñas enviadas" value={summary.total} />
        <StatCard title="Promedio otorgado" value={summary.average.toFixed(1)} />
      </div>

      <div className="flex items-center gap-2">
        <StarRating value={Math.round(summary.average)} readOnly size={20} />
        <span className="text-sm text-muted-foreground">
          {summary.average.toFixed(1)} / 5
        </span>
      </div>
    </div>
  );
}