import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCommerceSelectionStore } from "../store/useCommerceSelectionStore";
import type { AddCommerceResponseDto } from "feedbackboard-shared";

// Referencia estable: evita que `commerces` sea un array nuevo en cada
// render cuando el usuario no tiene comercios, lo cual invalidaría
// innecesariamente el useMemo de abajo.
const EMPTY_COMMERCES: AddCommerceResponseDto[] = [];

interface UseActiveCommerceResult {
  activeCommerce: AddCommerceResponseDto | null;
  activeCommerceId: string | null;
  setActiveCommerceId: (id: string) => void;
  commerces: AddCommerceResponseDto[];
}

export function useActiveCommerce(): UseActiveCommerceResult {
  const { state } = useAuth();
  const { activeCommerceId, setActiveCommerceId } = useCommerceSelectionStore();

  const commerces = state.user?.commerce ?? EMPTY_COMMERCES;

  const activeCommerce = useMemo(() => {
    const selected = commerces.find((c) => c.id === activeCommerceId);
    return selected ?? commerces[0] ?? null;
  }, [commerces, activeCommerceId]);

  return {
    activeCommerce,
    activeCommerceId: activeCommerce?.id ?? null,
    setActiveCommerceId,
    commerces,
  };
}