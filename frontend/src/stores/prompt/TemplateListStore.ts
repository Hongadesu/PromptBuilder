import { create } from 'zustand';

import { BaseItem } from '@/types';

type TemplateListState = {
  templateList: BaseItem[];
  maxPage: number;
};

type TemplateListActions = {
  setTemplateList: (templateList: BaseItem[]) => void;
  setMaxPage: (maxPage: number) => void;
  appendItem: (item: BaseItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<BaseItem>) => void;
  reset: () => void;
};

type TemplateListStoreType = TemplateListState & TemplateListActions;

const templateListInitState: TemplateListState = {
  templateList: [],
  maxPage: 0,
};

export const useTemplateListStore = create<TemplateListStoreType>(
  (set, get) => ({
    ...templateListInitState,
    setTemplateList: (templateList: BaseItem[]) => set({ templateList }),
    setMaxPage: (maxPage: number) => set({ maxPage }),
    appendItem: (item: BaseItem) => {
      set((state) => ({
        templateList: [...state.templateList, item],
      }));
    },
    removeItem: (id: string) => {
      set((state) => ({
        templateList: state.templateList.filter((item) => item.id !== id),
      }));
    },
    updateItem: (id: string, item: Partial<BaseItem>) => {
      set((state) => ({
        templateList: state.templateList.map((template) =>
          template.id === id ? { ...template, ...item } : template,
        ),
      }));
    },
    reset: () => set(templateListInitState),
  }),
);
