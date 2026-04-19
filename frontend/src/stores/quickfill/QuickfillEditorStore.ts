import React from 'react';
import { create } from 'zustand';
import {
  checkKeyValid,
  extractKeys,
  generateFunction,
} from '@/modules/prompt-funcs';

type QuickfillRowType = {
  value: string;
  isFrozen: boolean;
};

type QuickfillEditorState = {
  template: string;
  keyValueMap: Map<string, QuickfillRowType>;
};

type QuickfillEditorDoms = {
  newKeyRef: React.RefObject<HTMLInputElement>;
};

type QuickfillEditorActions = {
  setValue: (key: string, newValue: string) => void;
  setTemplate: (newTemplate: string) => void;
  switchFrozen: (key: string) => void;
  setEditor: (template: string, param: Record<string, string>) => void;
  newPair: () => void;
  newPairsAuto: () => void;
  removePair: (key: string) => void;
  extractKeys: () => string[];
  generate: () => string;
  reset: () => void;
};

type QuickfillEditorStoreType = QuickfillEditorState &
  QuickfillEditorDoms &
  QuickfillEditorActions;

const QuickfillEditorInitState: QuickfillEditorState & QuickfillEditorDoms = {
  template: '',
  keyValueMap: new Map<string, QuickfillRowType>(),
  newKeyRef: { current: null },
};

export const useQuickfillEditorStore = create<QuickfillEditorStoreType>(
  (set, get) => ({
    ...QuickfillEditorInitState,
    setValue: (key: string, newValue: string) =>
      set((state) => {
        if (!state.keyValueMap.has(key)) {
          return state;
        }
        const newKeyValueMap = new Map(state.keyValueMap);
        const row = newKeyValueMap.get(key)!;
        newKeyValueMap.set(key, { ...row, value: newValue });
        return {
          keyValueMap: newKeyValueMap,
        };
      }),
    setTemplate: (newTemplate: string) =>
      set((state) => ({ template: newTemplate })),
    switchFrozen: (key: string) => {
      set((state) => {
        if (!state.keyValueMap.has(key)) {
          return state;
        }
        const newKeyValueMap = new Map(state.keyValueMap);
        const row = newKeyValueMap.get(key)!;
        newKeyValueMap.set(key, { ...row, isFrozen: !row.isFrozen });
        return {
          keyValueMap: newKeyValueMap,
        };
      });
    },
    setEditor: (template: string, param: Record<string, string>) => {
      const keyValueMap = new Map<string, QuickfillRowType>();
      for (const [k, v] of Object.entries(param)) {
        keyValueMap.set(k, { value: v, isFrozen: v ? true : false });
      }
      set((state) => ({
        template,
        keyValueMap,
      }));
    },
    removePair: (key: string) => {
      set((state) => {
        if (!state.keyValueMap.has(key)) {
          return state;
        }
        const newKeyValueMap = new Map(state.keyValueMap);
        newKeyValueMap.delete(key);
        return {
          keyValueMap: newKeyValueMap,
        };
      });
    },
    newPair: () => {
      const inputEle = get().newKeyRef.current;
      if (!inputEle) {
        return;
      }
      const newKey = inputEle.value.trim();
      const isValid = checkKeyValid(newKey);
      if (!newKey || !isValid) {
        return;
      }

      set((state) => {
        if (state.keyValueMap.has(newKey)) {
          return state;
        }
        const newKeyValueMap = new Map(state.keyValueMap);
        newKeyValueMap.set(newKey, { value: '', isFrozen: false });
        return {
          keyValueMap: newKeyValueMap,
        };
      });

      inputEle.value = '';
    },
    newPairsAuto: () => {
      const keys = extractKeys(get().template);
      if (keys.length === 0) {
        return;
      }

      set((state) => {
        const newKeyValueMap = new Map(
          keys.map((key) => [
            key,
            state.keyValueMap.get(key) ?? { value: '', isFrozen: false },
          ]),
        );

        return { keyValueMap: newKeyValueMap };
      });
    },
    extractKeys: () => {
      return extractKeys(get().template);
    },
    generate: () => {
      const template = get().template;
      const keyValueMap = get().keyValueMap;
      if (keyValueMap.size === 0) {
        throw new Error('keyValueMap 不能為空');
      }

      const keys = Array.from(keyValueMap.keys());
      const values = Array.from(keyValueMap.values()).map((item) => item.value);
      const fn = generateFunction(template, keys);
      const result = fn(...values);
      console.log(result); // 測試用
      return result;
    },
    reset: () => set(QuickfillEditorInitState),
  }),
);
