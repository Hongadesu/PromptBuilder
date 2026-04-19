import { create } from 'zustand';

import { QuickfillItem } from '@/types';

type QuickfillListState = {
  templateList: QuickfillItem[];
  maxPage: number;
};

type QuickfillListActions = {
  setTemplateList: (templateList: QuickfillItem[]) => void;
  setMaxPage: (maxPage: number) => void;
  appendItem: (item: QuickfillItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<QuickfillItem>) => void;
  reset: () => void;
};

type QuickfillListStoreType = QuickfillListState & QuickfillListActions;

const templateListInitState: QuickfillListState = {
  templateList: [],
  maxPage: 1,
};

export const useQuickfillListStore = create<QuickfillListStoreType>(
  (set, get) => ({
    ...templateListInitState,
    setTemplateList: (templateList: QuickfillItem[]) => set({ templateList }),
    setMaxPage: (maxPage: number) => set({ maxPage }),
    appendItem: (item: QuickfillItem) => {
      set((state) => ({
        templateList: [...state.templateList, item],
      }));
    },
    removeItem: (id: string) => {
      set((state) => ({
        templateList: state.templateList.filter((item) => item.id !== id),
      }));
    },
    updateItem: (id: string, item: Partial<QuickfillItem>) => {
      set((state) => ({
        templateList: state.templateList.map((template) =>
          template.id === id ? { ...template, ...item } : template,
        ),
      }));
    },
    reset: () => set(templateListInitState),
  }),
);
