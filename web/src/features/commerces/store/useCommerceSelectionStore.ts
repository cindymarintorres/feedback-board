import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommerceSelectionState {
  activeCommerceId: string | null;
  setActiveCommerceId: (id: string) => void;
  clearSelection: () => void;
}

export const useCommerceSelectionStore = create<CommerceSelectionState>()(
  persist(
    (set) => ({
      activeCommerceId: null,
      setActiveCommerceId: (id) => set({ activeCommerceId: id }),
      clearSelection: () => set({ activeCommerceId: null }),
    }),
    {
      name: "commerce-selection-storage",
    },
  ),
);