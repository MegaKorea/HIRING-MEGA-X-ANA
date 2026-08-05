import { create } from 'zustand';

interface LayoutState {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  collapsed: false,
  mobileOpen: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
}));
