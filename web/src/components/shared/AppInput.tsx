import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type AppInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  showForgotPassword?: boolean;  // <-- prop nueva
  onRightIconClick?: () => void;
};

export function AppInput({
  label,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  showForgotPassword,
  onRightIconClick,
  className,
  id,
  ...props
}: AppInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        {showForgotPassword && 
        
        <Link
          to="/forgot-password"
          className="text-primary hover:underline font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        }

      </div>

      <div className="relative">
        {LeftIcon && (
          <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        )}

        <Input
          aria-invalid={!!error}
          id={id}
          className={cn(
            "py-1 h-9",
            LeftIcon && "pl-9",
            RightIcon && "pr-9",
            error &&
              "border-destructive focus-visible:ring-destructive focus-visible:ring-2",
            className,
          )}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RightIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
