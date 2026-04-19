import { create } from 'zustand';
import { GlobalApi } from '@/apis';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme | undefined;
}

interface ThemeAction {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const initState: ThemeState = {
  theme: undefined,
};

export const useThemeStore = create<ThemeState & ThemeAction>((set, get) => ({
  ...initState,

  toggleTheme: async () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    const resp = await GlobalApi.updateTheme(newTheme);
    if (resp.status !== 'success') {
      return;
    }
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    set({ theme: newTheme });
  },

  // TODO: Need Intergration
  // initializeTheme: () => {
  //   const saved = localStorage.getItem('theme') as Theme | null;
  //   const prefersDark = window.matchMedia(
  //     '(prefers-color-scheme: dark)',
  //   ).matches;
  //   const theme: Theme = saved || (prefersDark ? 'dark' : 'light');
  //   document.documentElement.classList.toggle('dark', theme === 'dark');
  //   set({ theme });
  // },
  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
