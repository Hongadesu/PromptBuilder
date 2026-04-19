import { create } from 'zustand';

// Side 展示的狀態管理
interface SideState {
  isSideOpen: boolean;
  setSideOpen: (status: boolean) => void;
  reset: () => void;
}

const FinDecideSidebarInitState = {
  isSideOpen: true,
};

export const useSideStateStore = create<SideState>((set) => ({
  ...FinDecideSidebarInitState,
  setSideOpen: (status: boolean) => set((state) => ({ isSideOpen: status })),
  reset: () => set(FinDecideSidebarInitState),
}));
