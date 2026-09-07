import { useMemo } from "react";
import { useCommerceReviewActions } from "@/features/reviews/hooks/useCommerceReviewActions";
import { useActiveCommerce } from "@/features/commerces/hooks/useActiveCommerce";
import { StatCard } from "./StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { CommerceReviewResponseDto } from "feedbackboard-shared";

const EMPTY_REVIEWS: CommerceReviewResponseDto[] = [];

const chartConfig = {
  average: {
    label: "Promedio",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function CommerceAdminBoardSection() {
  const { activeCommerceId, setActiveCommerceId, commerces } =
    useActiveCommerce();
  const { reviewsQuery } = useCommerceReviewActions({
    role: "COMMERCE_ADMIN",
    commerceId: activeCommerceId ?? undefined,
  });
  const reviews: CommerceReviewResponseDto[] =
    reviewsQuery.data ?? EMPTY_REVIEWS;

  const { total, average, trend } = useMemo(() => {
    if (reviews.length === 0) {
      return {
        total: 0,
        average: 0,
        trend: [] as { date: string; average: number }[],
      };
    }
    const total = reviews.length;
    const average = reviews.reduce((sum, r) => sum + r.stars, 0) / total;

    const byDay = new Map<string, { sum: number; count: number }>();
    for (const r of reviews) {
      const day = new Date(r.createdAt).toISOString().slice(0, 10);
      const entry = byDay.get(day) ?? { sum: 0, count: 0 };
      entry.sum += r.stars;
      entry.count += 1;
      byDay.set(day, entry);
    }
    const trend = [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { sum, count }]) => ({ date, average: sum / count }));

    return { total, average, trend };
  }, [reviews]);

  return (
    <div className="space-y-6">
      <Select
        value={activeCommerceId ?? ""}
        onValueChange={(value) => value && setActiveCommerceId(value)}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Elegí un comercio">
            {commerces.find((c) => c.id === activeCommerceId)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {commerces.map((com) => (
            <SelectItem key={com.id} value={com.id}>
              {com.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Total de reseñas" value={total} />
        <StatCard title="Promedio" value={average.toFixed(1)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="fillAverage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-average)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-average)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="average"
                type="natural"
                fill="url(#fillAverage)"
                stroke="var(--color-average)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
