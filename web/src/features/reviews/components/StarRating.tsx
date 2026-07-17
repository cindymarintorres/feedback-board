import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 24,
}: StarRatingProps) {
  return (
    <div
      className="flex gap-1"
      role={readOnly ? "img" : undefined}
      aria-label={readOnly ? `${value} de 5 estrellas` : undefined}
    >
      {[1, 2, 3, 4, 5].map((starValue) => {
        const icon = (
          <Star
            size={size}
            className={
              starValue <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }
          />
        );

        if (readOnly) {
          return <span key={starValue}>{icon}</span>;
        }

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange?.(starValue)}
            aria-label={`${starValue} estrellas`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
