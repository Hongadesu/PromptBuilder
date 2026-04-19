import { create } from 'zustand';
import { GroupData } from '@/types';

type GroupListState = {
  groupList: GroupData[];
  maxPage: number;
};

type GroupListActions = {
  setGroupList: (groupList: GroupData[]) => void;
  setMaxPage: (maxPage: number) => void;
  appendGroup: (item: GroupData) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, item: Partial<Omit<GroupData, 'groupId'>>) => void;
  reset: () => void;
};

type GroupListStoreType = GroupListState & GroupListActions;

const GroupListInitState: GroupListState = {
  groupList: [],
  maxPage: 0,
};

export const useGroupListStore = create<GroupListStoreType>((set, get) => ({
  ...GroupListInitState,
  setGroupList: (groupList: GroupData[]) => set({ groupList }),
  setMaxPage: (maxPage: number) => set({ maxPage }),
  appendGroup: (item: GroupData) => {
    set((state) => ({ groupList: [...state.groupList, item] }));
  },
  removeGroup: (id: string) => {
    set((state) => ({
      groupList: state.groupList.filter((item) => item.groupId !== id),
    }));
  },
  updateGroup: (id: string, item: Partial<Omit<GroupData, 'groupId'>>) => {
    set((state) => ({
      groupList: state.groupList.map((group) =>
        group.groupId === id ? { ...group, ...item } : group,
      ),
    }));
  },
  reset: () => set(GroupListInitState),
}));
