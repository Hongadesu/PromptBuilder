import { create } from 'zustand';
import { generateFunction } from '@/modules/prompt-funcs';
import { BaseItem } from '@/types';

type TemplateDetailState = {
  id: string;
  title: string;
  description: string;
  template: string;
  keyValueMap: Record<string, string>;
  cache: BaseItem | null;
};

type TemplateDetailActions = {
  setValue: (key: string, newValue: string) => void;
  setDetail: (item: BaseItem) => void;
  generate: () => string;
  reset: () => void;
};

type TemplateDetailStoreType = TemplateDetailState & TemplateDetailActions;

const TemplateDetailInitState: TemplateDetailState = {
  // TemplateDetailMeta
  id: '',
  title: '',
  description: '',

  // TemplateDetailState
  template: '',
  keyValueMap: {},

  cache: null,
};

export const useTemplateDetailStore = create<TemplateDetailStoreType>(
  (set, get) => ({
    ...TemplateDetailInitState,
    setValue: (key: string, newValue: string) =>
      set((state) => {
        return {
          keyValueMap: {
            ...state.keyValueMap,
            [key]: newValue,
          },
        };
      }),
    setDetail: (item: BaseItem) =>
      set((state) => ({
        cache: item,
        id: item.id,
        title: item.title,
        description: item.description,
        template: item.template,
        keyValueMap: item.param,
      })),
    generate: () => {
      const template = get().template;
      if (Object.keys(get().keyValueMap).length === 0) {
        throw new Error('keyValueMap 不能為空');
      }

      const keys = Object.keys(get().keyValueMap);
      const values = Object.values(get().keyValueMap);
      const fn = generateFunction(template, keys);
      const result = fn(...values);
      return result;
    },
    reset: () => set(TemplateDetailInitState),
  }),
);
