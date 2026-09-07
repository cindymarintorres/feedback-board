import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DateRangePreset } from "../hooks/useDateRangeFilter";

const PRESET_LABELS: Record<DateRangePreset, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  all: "Todo el tiempo",
  custom: "Personalizado",
};

interface DateRangeFilterProps {
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  customRange: DateRange | undefined;
  onCustomRangeChange: (range: DateRange | undefined) => void;
}

export function DateRangeFilter({
  preset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex gap-3 items-center flex-wrap">
      <Select
        value={preset}
        onValueChange={(value) => onPresetChange(value as DateRangePreset)}
      >
        <SelectTrigger className="w-48">
          <SelectValue>{PRESET_LABELS[preset]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(PRESET_LABELS) as DateRangePreset[]).map((key) => (
            <SelectItem key={key} value={key}>
              {PRESET_LABELS[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-64 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customRange?.from
                  ? customRange.to
                    ? `${customRange.from.toLocaleDateString()} - ${customRange.to.toLocaleDateString()}`
                    : customRange.from.toLocaleDateString()
                  : "Elegí un rango"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={onCustomRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
