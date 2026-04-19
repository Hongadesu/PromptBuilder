import { create } from 'zustand';
import { generateFunction } from '@/modules/prompt-funcs';
import { TemplateKeyValue, QuickfillItem } from '@/types';

type QuickfillDetailState = {
  id: string;
  title: string;
  description: string;
  template: string;
  keyValueMap: (TemplateKeyValue & { frozen: boolean })[];
  cache: QuickfillItem | null;
};

type QuickfillMethodItem = {
  template: string;
  param: Record<string, string>;
};

type QuickfillDetailActions = {
  setValue: (key: string, newValue: string) => void;
  setDetail: (item: QuickfillItem) => void;
  generate: () => string;
  quickGenerate: (currContent: string) => string;
  quickfill: (item: QuickfillMethodItem, currContent: string) => string;
  reset: () => void;
};

type QuickfillDetailStoreType = QuickfillDetailState & QuickfillDetailActions;

const QuickfillDetailInitState: QuickfillDetailState = {
  id: '',
  title: '',
  description: '',
  template: '',
  keyValueMap: [],
  cache: null,
};

export const useQuickfillDetailStore = create<QuickfillDetailStoreType>(
  (set, get) => ({
    ...QuickfillDetailInitState,
    setValue: (key: string, newValue: string) => {
      set((state) => ({
        keyValueMap: state.keyValueMap.map((item) =>
          item.key === key ? { ...item, value: newValue } : item,
        ),
      }));
    },
    setDetail: (item: QuickfillItem) => {
      const keyValueMap = Object.entries(item.param).map(([k, v]) => ({
        key: k,
        value: v,
        frozen: v ? true : false,
      }));

      set((state) => ({
        cache: item,
        keyValueMap,
        ...item,
      }));
    },
    generate: () => {
      const template = get().template;
      if (get().keyValueMap.length === 0) {
        throw new Error('keyValueMap 不能為空');
      }

      const keys = get().keyValueMap.map((item) => item.key);
      const values = get().keyValueMap.map((item) => item.value);
      const fn = generateFunction(template, keys);
      const result = fn(...values);
      return result;
    },
    quickGenerate: (currContent: string) => {
      const unfrozenItems = get().keyValueMap.filter((item) => !item.frozen);
      if (unfrozenItems.length !== 1) {
        throw new Error('keyValueMap 中 frozen 的數量必須唯一');
      }

      const targetKey = unfrozenItems[0].key;
      const keyValueMap = get().keyValueMap.map((item) =>
        item.key === targetKey ? { ...item, value: currContent } : item,
      );

      const keys = keyValueMap.map((item) => item.key);
      const values = keyValueMap.map((item) => item.value);
      const template = get().template;
      const fn = generateFunction(template, keys);
      const result = fn(...values);
      return result;
    },
    quickfill: (item: QuickfillMethodItem, currContent: string) => {
      const param = { ...item.param };
      const unfrozenItems = Object.keys(param).filter((k) => param[k] === '');
      if (unfrozenItems.length !== 1) {
        throw new Error('keyValueMap 中 frozen 的數量不唯一');
      }

      const targetKey = unfrozenItems[0];
      param[targetKey] = currContent;

      const keys = Object.keys(param);
      const values = Object.values(param);
      const template = item.template;
      const fn = generateFunction(template, keys);
      const result = fn(...values);
      console.log(result);
      return result;
    },
    reset: () => set(QuickfillDetailInitState),
  }),
);
