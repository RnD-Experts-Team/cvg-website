import { create } from "zustand";

type UIState = {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  globalLoading: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setGlobalLoading: (val: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  darkMode: false,
  globalLoading: false,

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  toggleDarkMode: () =>
    set((s) => ({ darkMode: !s.darkMode })),

  setGlobalLoading: (val) => set({ globalLoading: val }),
}));
