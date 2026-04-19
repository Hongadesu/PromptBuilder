import React from 'react';
import { create } from 'zustand';
import {
  checkKeyValid,
  extractKeys,
  generateFunction,
} from '@/modules/prompt-funcs';

type PromptEditorState = {
  template: string;
  keyValueMap: Map<string, string>;
};

type PromptEditorDoms = {
  newKeyRef: React.RefObject<HTMLInputElement>;
};

type PromptEditorActions = {
  setValue: (key: string, newValue: string) => void;
  setTemplate: (newTemplate: string) => void;
  setEditor: (template: string, param: Record<string, string>) => void;
  newPair: () => void;
  newPairsAuto: () => void;
  removePair: (key: string) => void;
  extractKeys: () => string[];
  generate: () => string;
  reset: () => void;
};

type PromptEditorStoreType = PromptEditorState &
  PromptEditorDoms &
  PromptEditorActions;

const PromptEditorInitState: PromptEditorState & PromptEditorDoms = {
  template: '',
  keyValueMap: new Map<string, string>(),
  newKeyRef: { current: null },
};

export const usePromptEditorStore = create<PromptEditorStoreType>(
  (set, get) => ({
    ...PromptEditorInitState,
    setValue: (key: string, newValue: string) =>
      set((state) => {
        const newKeyValueMap = new Map(state.keyValueMap);
        newKeyValueMap.set(key, newValue);
        return {
          keyValueMap: newKeyValueMap,
        };
      }),
    setTemplate: (newTemplate: string) =>
      set((state) => ({ template: newTemplate })),
    setEditor: (template: string, param: Record<string, string>) => {
      const keyValueMap = new Map(Object.entries(param));
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
          // 如果鍵已存在，則不做任何更改
          return state;
        }
        const newKeyValueMap = new Map(state.keyValueMap);
        newKeyValueMap.set(newKey, '');
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
          keys.map((key) => [key, state.keyValueMap.get(key) ?? '']),
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
      const values = Array.from(keyValueMap.values());
      const fn = generateFunction(template, keys);
      const result = fn(...values);
      console.log(result); // 測試用
      return result;
    },
    reset: () => set({ ...PromptEditorInitState }),
  }),
);
