import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

export type DateRangePreset = "7d" | "30d" | "90d" | "all" | "custom";

export function useDateRangeFilter() {
  const [preset, setPreset] = useState<DateRangePreset>("30d");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const { from, to } = useMemo(() => {
    if (preset === "all") return {};
    if (preset === "custom") {
      return {
        from: customRange?.from?.toISOString(),
        to: customRange?.to?.toISOString(),
      };
    }
    const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [preset, customRange]);

  return { preset, setPreset, customRange, setCustomRange, from, to };
}