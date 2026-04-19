import { create } from 'zustand';

import { TemplateItem } from '@/types';

type TemplatePinState = {
  templateList: TemplateItem[];
};

type TemplatePinActions = {
  setTemplateList: (templateList: TemplateItem[]) => void;
  appendItem: (item: TemplateItem) => void;
  removeItem: (id: string) => void;
  // updateItem: (id: string, item: Partial<TemplateItem>) => void;
  reset: () => void;
};

type TemplatePinStoreType = TemplatePinState & TemplatePinActions;

const templateListInitState: TemplatePinState = {
  templateList: [],
};

export const useTemplatePinStore = create<TemplatePinStoreType>((set, get) => ({
  ...templateListInitState,
  setTemplateList: (templateList: TemplateItem[]) => set({ templateList }),
  appendItem: (item: TemplateItem) =>
    set((state) => ({
      templateList: [...state.templateList, item],
    })),
  removeItem: (id: string) =>
    set((state) => ({
      templateList: state.templateList.filter((item) => item.id !== id),
    })),
  // updateItem: (id: string, item: Partial<Omit<TemplateItem, 'id'>>) => {
  //   set((state) => ({
  //     templateList: state.templateList.map((template) =>
  //       template.id === id ? { ...template, ...item } : template,
  //     ),
  //   }));
  // },
  reset: () => set(templateListInitState),
}));
