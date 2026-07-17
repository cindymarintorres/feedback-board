import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUserSelectionState {
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
  clearSelection: () => void;
}

export const useAdminUserSelectionStore = create<AdminUserSelectionState>()(
  persist(
    (set) => ({
      selectedUserId: null,
      setSelectedUserId: (id) => set({ selectedUserId: id }),
      clearSelection: () => set({ selectedUserId: null }),
    }),
    {
      name: "admin-user-selection-storage",
    },
  ),
);