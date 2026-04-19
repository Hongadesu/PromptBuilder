import { create } from 'zustand';
import { Minus, Plus } from 'lucide-react';
import { GroupData, TemplateType } from '@/types';
import { GroupApi } from '@/apis';
import {
  Button,
  Dialog,
  FeedbackButton,
  showToast,
  Tooltip,
} from '@/components/global';
import { useEffect } from 'react';
import styles from '@/styles/Scrollbar.module.css';
import { cn } from '@/modules/utils';
import { useGlobalStore } from '@/stores';

type GroupAddPortalState = {
  templateId: string | null;
  templateType: TemplateType | null;
  existGroups: GroupData[];
  recordedGroups: GroupData[];
};

type GroupAddPortalActions = {
  init: (templateId: string) => void;
  setExistGroup: () => Promise<void>;
  setRecordedGroup: (templateId: string) => Promise<void>;
  addRecordedGroup: (group: GroupData) => void;
  removeRecordedGroup: (groupId: string) => void;
  setData: (templateId: string, templateType: TemplateType) => void;
  reset: () => void;
};

type GroupAddPortalStoreType = GroupAddPortalState & GroupAddPortalActions;

const GroupAddPortalInitState: GroupAddPortalState = {
  templateId: null,
  templateType: null,
  existGroups: [],
  recordedGroups: [],
};

export const useGroupAddPortalStore = create<GroupAddPortalStoreType>(
  (set, get) => ({
    ...GroupAddPortalInitState,
    init(templateId: string) {
      Promise.all([get().setExistGroup(), get().setRecordedGroup(templateId)]);
    },
    async setExistGroup() {
      // 根據當前 "存在的所有群組"
      const resp = await GroupApi.getAllGroups();
      if (resp.status !== 'success') {
        return;
      }
      set({ existGroups: resp.groups });
    },
    async setRecordedGroup(templateId: string) {
      // 根據當前 templateId 獲取所有 "已經加入的群組"
      const resp = await GroupApi.getGroupsByTemplateId(templateId);
      if (resp.status !== 'success') {
        return;
      }
      set({ recordedGroups: resp.groups });
    },
    setData(templateId: string, templateType: TemplateType) {
      set({ templateId, templateType });
    },
    addRecordedGroup: (group: GroupData) => {
      const recordedGroups = get().recordedGroups;
      set({ recordedGroups: [...recordedGroups, group] });
    },
    removeRecordedGroup: (groupId: string) => {
      const recordedGroups = get().recordedGroups;
      set({
        recordedGroups: recordedGroups.filter(
          (group) => group.groupId !== groupId,
        ),
      });
    },
    reset() {
      set(GroupAddPortalInitState);
    },
  }),
);

export function GroupAddButton({
  open,
  onOpenChange,
  onClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClick?: () => void;
}) {
  return (
    <Dialog
      title='刪除模板對話'
      description='刪除模板對話'
      open={open}
      onOpenChange={onOpenChange}
      portal={<GroupAddPortal onClose={() => onOpenChange(false)} />}
    >
      <Button
        title='新增至群組'
        type='button'
        variant='outline'
        className='size-7 box-border min-md:size-8'
        onClick={onClick}
      >
        <Tooltip content='新增至群組' side='left' delayDuration={0}>
          <Plus />
        </Tooltip>
      </Button>
    </Dialog>
  );
}

function GroupAddPortal({ onClose }: { onClose: () => void }) {
  const init = useGroupAddPortalStore.getState().init;
  const reset = useGroupAddPortalStore.getState().reset;
  const templateId = useGroupAddPortalStore((state) => state.templateId);

  useEffect(() => {
    if (templateId) {
      init(templateId);
    }
    return () => reset();
  }, [templateId]);

  return (
    <div className='p-4 bg-[var(--surface)] border border-[var(--border)] rounded-md space-y-4 w-lg max-lg:w-md max-md:w-96'>
      <div>
        <h2 className='font-bold text-xl text-[var(--on-surface)]'>
          選取要加入的群組
        </h2>
      </div>
      <div className='flex gap-2'>
        <div className='flex-1/2'>
          <h3 className='mb-2 font-noto text-[var(--on-bg)]'>已有的群組</h3>
          <GroupExistList />
        </div>
        <div className='flex-1/2'>
          <h3 className='mb-2 font-noto text-[var(--on-bg)]'>已加入的群組</h3>
          <GroupRecordedList />
        </div>
      </div>
      <div>
        <Button
          title='完成'
          type='button'
          variant='default'
          className='h-8 px-2 box-border ml-auto'
          onClick={onClose}
        >
          完成
        </Button>
      </div>
    </div>
  );
}

export function GroupExistList() {
  const existGroups = useGroupAddPortalStore((state) => state.existGroups);
  return (
    <div className='w-full h-64 overflow-hidden select-none'>
      <div
        className={cn(
          styles.surfaceScrollable,
          'h-full overflow-y-auto rounded-md border border-[var(--on-bg)]',
        )}
      >
        <ul className='flex flex-col gap-1 p-1 pr-2'>
          {existGroups.map((group) => (
            <li
              key={`${group.groupId}`}
              className='group flex gap-1 items-center rounded-md p-2 bg-transparent hover:bg-[var(--border)]/30'
            >
              <div className='text-sm text-[var(--on-surface)] group-hover:text-[var(--on-border)]'>
                {group.group}
              </div>
              <FeedbackButton
                title='新增'
                type='button'
                variant='ghost'
                className='ml-auto size-6 box-border opacity-0 group-hover:opacity-100'
                onClick={async () => {
                  const { templateId, templateType } =
                    useGroupAddPortalStore.getState();
                  if (!templateId || !templateType) {
                    throw new Error('模板數據異常');
                  }
                  const status = await useGlobalStore
                    .getState()
                    .appendTemplateIntoGroup({
                      groupId: group.groupId,
                      templateId,
                      type: templateType,
                    });
                  switch (status) {
                    case 'error':
                      showToast({ type: 'error', message: '加入失敗' });
                      throw new Error('加入失敗');

                    case 'conflict':
                      showToast({ type: 'info', message: '群組已存在' });
                      throw new Error('群組已存在');

                    default:
                      showToast({ type: 'success', message: '加入成功' });
                      useGroupAddPortalStore.getState().addRecordedGroup(group);
                      break;
                  }
                }}
              >
                <Plus />
              </FeedbackButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function GroupRecordedList() {
  const recordedGroups = useGroupAddPortalStore(
    (state) => state.recordedGroups,
  );
  return (
    <div className='w-full h-64 overflow-hidden select-none'>
      <div
        className={cn(
          styles.surfaceScrollable,
          'h-full overflow-y-auto rounded-md border border-[var(--on-bg)]',
        )}
      >
        <ul className='flex flex-col gap-1 p-1 pr-2'>
          {recordedGroups.map((group) => (
            <li
              key={`${group.groupId}`}
              className='group flex gap-1 items-center rounded-md p-2 bg-transparent'
            >
              <div className='text-sm text-[var(--on-surface)]'>
                {group.group}
              </div>
              <FeedbackButton
                title='移除'
                type='button'
                variant='ghostDestructive'
                className='ml-auto size-6 box-border opacity-0 group-hover:opacity-100'
                onClick={async () => {
                  const { templateId, templateType } =
                    useGroupAddPortalStore.getState();
                  if (!templateId || !templateType) {
                    throw new Error('模板數據異常');
                  }
                  const success = await useGlobalStore
                    .getState()
                    .removeTemplateIntoGroup(templateId, group.groupId);
                  if (!success) {
                    showToast({ type: 'error', message: '移除失敗' });
                    throw new Error('移除失敗');
                  }
                  showToast({ type: 'success', message: '移除成功' });
                  useGroupAddPortalStore
                    .getState()
                    .removeRecordedGroup(group.groupId);
                }}
              >
                <Minus />
              </FeedbackButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
