import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AppTextareaProps = React.ComponentProps<typeof Textarea> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function AppTextarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: AppTextareaProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Textarea
        aria-invalid={!!error}
        id={id}
        className={cn(
          "resize-none",
          error &&
            "border-destructive focus-visible:ring-destructive focus-visible:ring-2",
          className,
        )}
        {...props}
      />

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}