import { create } from 'zustand';
import { GroupData, TemplateItem } from '@/types';

type GroupDetailState = GroupData & {
  templateList: TemplateItem[];
};

type GroupDetailActions = {
  setGroupItem: (item: GroupData) => void;
  setTemplateList: (templateList: TemplateItem[]) => void;
  reset: () => void;
};

type GroupDetailStoreType = GroupDetailState & GroupDetailActions;

const GroupDetailInitState: GroupDetailState = {
  groupId: '',
  group: '',
  description: '',
  templateList: [],
};

export const useGroupDetailStore = create<GroupDetailStoreType>((set, get) => ({
  ...GroupDetailInitState,
  setGroupItem: (item: GroupData) =>
    set({
      groupId: item.groupId,
      group: item.group,
      description: item.description,
    }),
  setTemplateList: (templateList: TemplateItem[]) => set({ templateList }),
  reset: () => set(GroupDetailInitState),
}));
