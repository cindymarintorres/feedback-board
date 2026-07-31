import { AppButton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Pencil, Store, Trash2 } from "lucide-react";
import type { AddCommerceResponseDto } from "feedbackboard-shared";

interface CommerceCardProps {
  commerce: AddCommerceResponseDto;
  onEdit?: (commerce: AddCommerceResponseDto) => void;
  onDelete?: (commerce: AddCommerceResponseDto) => void;
}

export function CommerceCard({ commerce, onEdit, onDelete }: CommerceCardProps) {
  const showActions = commerce.verified && (onEdit || onDelete);

  return (
    <div className="rounded-lg border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{commerce.name}</p>
            <p className="text-xs text-muted-foreground">/{commerce.slug}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Badge
            variant={commerce.verified ? "default" : "secondary"}
            className="leading-0 w-full"
          >
            {commerce.verified ? "Verificado" : "Pendiente"}
          </Badge>
          {showActions && (
            <div className="flex flex-row gap-2">
              {onEdit && (
                <AppButton
                  type="button"
                  leftIcon={Pencil}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3"
                  onClick={() => onEdit(commerce)}
                  title="Editar"
                />
              )}
              {onDelete && (
                <AppButton
                  type="button"
                  leftIcon={Trash2}
                  className="bg-destructive text-white hover:bg-destructive/90 px-3"
                  onClick={() => onDelete(commerce)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}