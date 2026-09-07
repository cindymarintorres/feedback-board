import { useDateRangeFilter } from "../hooks/useDateRangeFilter";
import { usePlatformStats } from "../hooks/usePlatformStats";
import { DateRangeFilter } from "./DateRangeFilter";
import { StatCard } from "./StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  averageStars: {
    label: "Promedio",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function AdminBoardSection() {
  const { preset, setPreset, customRange, setCustomRange, from, to } =
    useDateRangeFilter();
  const statsQuery = usePlatformStats({ from, to });
  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      <DateRangeFilter
        preset={preset}
        onPresetChange={setPreset}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
      />

      {statsQuery.isLoading && (
        <p className="text-sm text-muted-foreground">
          Cargando estadísticas...
        </p>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Usuarios totales" value={stats.totalUsers} />
            <StatCard title="Comercios totales" value={stats.totalCommerces} />
            <StatCard title="Reseñas en el rango" value={stats.totalReviews} />
            <StatCard
              title="Promedio global"
              value={stats.averageStars.toFixed(1)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia de calificaciones</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={stats.trend}>
                  <defs>
                    <linearGradient
                      id="fillAverageStars"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-averageStars)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-averageStars)"
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
                    dataKey="averageStars"
                    type="natural"
                    fill="url(#fillAverageStars)"
                    stroke="var(--color-averageStars)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 comercios por calificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.topCommerces.map((c, i) => (
                <div
                  key={c.commerceId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {i + 1}. {c.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{c.totalReviews} reseñas</Badge>
                    <span className="font-medium">
                      {c.averageStars.toFixed(1)} ★
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
