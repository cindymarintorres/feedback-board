import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveCommerce } from "@/features/commerces/hooks/useActiveCommerce";
import { useCommerceReviewActions } from "../hooks/useCommerceReviewActions";
import { StarRating } from "../components/StarRating";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type {
  CommerceReviewResponseDto,
  Order,
  PublicUser,
} from "feedbackboard-shared";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";
import { useAdminUserSelectionStore } from "@/features/admin/store/useAdminUserSelectionStore";

export function RatingsPage() {
  const { state } = useAuth();
  const role = state.user?.role;
  const [order, setOrder] = useState<Order>("newest");
  const EMPTY_REVIEWS: CommerceReviewResponseDto[] = [];
  const ORDER_LABELS: Record<Order, string> = {
  newest: "Más recientes",
  oldest: "Más antiguas",
};
  // COMMERCE_ADMIN: selección de su propio comercio
  const { activeCommerceId, setActiveCommerceId, commerces } =
    useActiveCommerce();

  // ADMIN: selección de owner (COMMERCE_ADMIN) cuyos comercios quiere ver.
  // Sin fallback automático al primero — a diferencia de useActiveCommerce,
  // acá puede haber muchos owners y elegir uno al azar no tiene sentido.
  const { selectedUserId, setSelectedUserId } = useAdminUserSelectionStore();

  const commerceAdminsQuery = useQuery<PublicUser[]>({
    queryKey: ["commerce-admins"],
    queryFn: () => usersService.findAll(),
    enabled: role === "ADMIN",
    select: (users: PublicUser[]) =>
      users.filter((user) => user.role === "COMMERCE_ADMIN"),
  });

  const commerceAdmins = commerceAdminsQuery.data ?? [];

  const { reviewsQuery } = useCommerceReviewActions({
    role,
    commerceId:
      role === "COMMERCE_ADMIN" ? (activeCommerceId ?? undefined) : undefined,
    ownerId: role === "ADMIN" ? (selectedUserId ?? undefined) : undefined,
    order,
  });

  const reviews: CommerceReviewResponseDto[] = reviewsQuery.data ?? EMPTY_REVIEWS;

  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, total: 0, byCategory: {} as Record<string, number> };
    }
    const total = reviews.length;
    const average =
      reviews.reduce(
        (sum: number, r: CommerceReviewResponseDto) => sum + r.stars,
        0,
      ) / total;
    const byCategory = reviews.reduce<Record<string, number>>(
      (acc: Record<string, number>, r: CommerceReviewResponseDto) => {
        const key = r.category ?? "SIN_CATEGORIA";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {},
    );
    return { average, total, byCategory };
  }, [reviews]);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap items-center">
        {role === "COMMERCE_ADMIN" && (
          <Select
            value={activeCommerceId ?? undefined}
            onValueChange={(value) => value && setActiveCommerceId(value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Elegí un comercio" />
            </SelectTrigger>
            <SelectContent>
              {commerces.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {role === "ADMIN" && (
          <Select
            value={selectedUserId ?? undefined}
            onValueChange={(value) => value && setSelectedUserId(value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Elegí un usuario (comercio admin)" />
            </SelectTrigger>
            <SelectContent>
              {commerceAdmins.map((user : PublicUser) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={order}
          onValueChange={(value) => value && setOrder(value as Order)}
        >
          <SelectTrigger className="w-40">
            <SelectValue>{ORDER_LABELS[order]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="oldest">Más antiguas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>
            {summary.total} reseña{summary.total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <StarRating
              value={Math.round(summary.average)}
              readOnly
              size={20}
            />
            <span className="text-sm text-muted-foreground">
              {summary.average.toFixed(1)} / 5
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(summary.byCategory).map(([cat, count]) => (
              <Badge key={cat} variant="secondary">
                {cat}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {reviewsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Cargando reseñas...</p>
        )}
        {!reviewsQuery.isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay reseñas.
          </p>
        )}
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <StarRating value={review.stars} readOnly size={16} />
                {review.category && (
                  <Badge variant="outline">{review.category}</Badge>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{review.author.name}</span>
                {(role === "MEMBER" || role === "ADMIN") && (
                  <span>{review.commerce.name}</span>
                )}
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
