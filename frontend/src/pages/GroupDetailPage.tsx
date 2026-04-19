import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { create } from 'zustand';
import { Undo2, Zap } from 'lucide-react';

import { Button, Dialog, FeedbackButton } from '@/components/global';
import {
  useGlobalStore,
  useGroupDetailStore,
  useTemplateDetailStore,
  useQuickfillDetailStore,
} from '@/stores';
import { PywebviewApi } from '@/apis';
import { useIsTall } from '@/hooks';
import { TemplateType } from '@/types';
import { GroupDetail } from '@/features/group/GroupDetail';
import { TemplateDetailInfo } from '@/features/default/TemplateDetailInfo';
import { TemplateDetailInfoPortal } from '@/features/default/TemplateDetailPortal';
import { QuickfillDetailInfo } from '@/features/quickfill/QuickfillDetailInfo';
import { QuickfillDetailPortal } from '@/features/quickfill/QuickfillDetailPortal';
import { GroupMemberEditor } from '@/features/group/GroupMemberEditor';
import { cn } from '@/modules/utils';

interface PageState {
  selectedId: string | undefined;
  selectedType: TemplateType | 'unset';
}

interface PageActions {
  setSelectedId: (selectedId: string | undefined) => void;
  setSelectedType: (type: TemplateType | 'unset') => void;
  reset: () => void;
}

const initPageState: PageState = {
  selectedId: undefined,
  selectedType: 'unset',
};

const usePage = create<PageState & PageActions>((set, get) => ({
  ...initPageState,
  setSelectedId(selectedId: string | undefined) {
    set(() => ({ selectedId }));
  },
  setSelectedType(type: TemplateType | 'unset') {
    set(() => ({ selectedType: type }));
  },
  reset() {
    set(initPageState);
  },
}));

export function GroupDetailPage() {
  const navigate = useNavigate();

  const { groupId } = useParams();
  const templateList = useGroupDetailStore((state) => state.templateList);

  const pageReset = usePage.getState().reset;
  const setSelectedType = usePage.getState().setSelectedType;
  const setSelectedId = usePage.getState().setSelectedId;
  const selectedId = usePage((state) => state.selectedId);

  const { isTall } = useIsTall();

  useEffect(() => {
    return () => pageReset();
  }, []);

  useEffect(() => {
    if (!groupId) {
      return;
    }
    useGlobalStore.getState().getGroupDetail(groupId);
    return () => {
      useGroupDetailStore.getState().reset();
      useQuickfillDetailStore.getState().reset();
    };
  }, []);

  if (!groupId) {
    return <></>;
  }

  return (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-y-auto bg-(--bg) p-4 transition-all duration-500'>
      {isTall && (
        <div className='mx-4 mt-4 flex gap-2 max-lg:mx-auto max-lg:w-11/12'>
          <h1 className='text-2xl font-extrabold text-(--on-bg-title)'>
            群組詳情
          </h1>
          <Button
            title='上一頁'
            type='button'
            variant='outline'
            className='ml-auto box-border size-8'
            onClick={() => navigate(-1)}
          >
            <Undo2 />
          </Button>
          <GroupMemberEditor groupId={groupId}>
            <Button
              title='調整群組模板'
              variant='secondary'
              className='h-8 px-2'
            >
              調整群組模板
            </Button>
          </GroupMemberEditor>
        </div>
      )}
      <div className='flex-1 overflow-hidden'>
        <GroupDetail className='flex h-full flex-col gap-4 max-lg:mx-auto max-lg:w-11/12'>
          <header className='flex items-center gap-2'>
            <GroupDetail.Title />
            <GroupDetail.ButtonSetA className='ml-auto' />
          </header>
          <GroupDetail.Description />
          {templateList.length !== 0 ? (
            <GroupDetail.GridPanel>
              {templateList.map((item) => {
                const isActive = selectedId === item.id;

                if (item.type === 'default') {
                  return (
                    <GroupDetail.GridItem asChild key={item.id}>
                      <li
                        className={cn(
                          'group cursor-pointer rounded-md border p-4 select-none',
                          isActive
                            ? 'border-(--secondary) bg-(--secondary)'
                            : 'border-(--border) bg-(--surface)',
                        )}
                        onClick={() => {
                          setSelectedId(item.id);
                          useTemplateDetailStore.getState().setDetail(item);
                          setSelectedType('default');
                        }}
                      >
                        <div
                          className={cn(
                            'line-clamp-1 font-bold',
                            isActive
                              ? 'text-(--on-secondary)'
                              : 'text-(--on-muted) group-hover:text-(--on-surface)',
                          )}
                        >
                          {item.title}
                        </div>
                        <p
                          className={cn(
                            'line-clamp-3 text-sm',
                            isActive
                              ? 'text-(--on-secondary)'
                              : 'text-(--on-muted) group-hover:text-(--on-surface)',
                          )}
                        >
                          {item.description}
                        </p>
                      </li>
                    </GroupDetail.GridItem>
                  );
                } else if (item.type === 'quickfill') {
                  return (
                    <GroupDetail.GridItem asChild key={item.id}>
                      <li
                        className={cn(
                          'group cursor-pointer rounded-md border p-4 select-none',
                          isActive
                            ? 'border-(--secondary) bg-(--secondary)'
                            : 'border-(--border) bg-(--surface)',
                        )}
                        onClick={() => {
                          setSelectedId(item.id);
                          useQuickfillDetailStore.getState().setDetail(item);
                          setSelectedType('quickfill');
                        }}
                      >
                        <div className='flex gap-2'>
                          <span
                            className={cn(
                              'line-clamp-1 font-bold',
                              isActive
                                ? 'text-(--on-secondary)'
                                : 'text-(--on-muted) group-hover:text-(--on-surface)',
                            )}
                          >
                            {item.title}
                          </span>
                          <FeedbackButton
                            title='快速轉換'
                            type='button'
                            variant='ghost'
                            className='ml-auto flex size-7 opacity-0 group-hover:opacity-100'
                            onClick={async (e) => {
                              e.stopPropagation();
                              const currContent =
                                await PywebviewApi.pasteText();
                              const result = useQuickfillDetailStore
                                .getState()
                                .quickfill(
                                  {
                                    template: item.template,
                                    param: item.param,
                                  },
                                  currContent,
                                );
                              await PywebviewApi.copyText(result);
                            }}
                          >
                            <Zap />
                          </FeedbackButton>
                        </div>
                        <p
                          className={cn(
                            'line-clamp-3 text-sm',
                            isActive
                              ? 'text-(--on-secondary)'
                              : 'text-(--on-muted) group-hover:text-(--on-surface)',
                          )}
                        >
                          {item.description}
                        </p>
                      </li>
                    </GroupDetail.GridItem>
                  );
                }
              })}
            </GroupDetail.GridPanel>
          ) : (
            <div className='h-full w-full content-center rounded-lg border border-(--on-muted) px-2 text-xl select-none'>
              <p className='font-noto text-center text-(--on-muted)'>
                群組中沒有任何模板
              </p>
            </div>
          )}
        </GroupDetail>
      </div>
      {isTall ? (
        <InfoPanel className='flex-1 overflow-hidden' />
      ) : (
        <InfoPanelPortal />
      )}
    </div>
  );
}

function InfoPanel({ className }: { className?: string }) {
  const setSelectedId = usePage.getState().setSelectedId;
  const setType = usePage.getState().setSelectedType;
  const type = usePage((state) => state.selectedType);

  return (
    <div
      className={cn(
        'mx-4 overflow-y-auto rounded-md border border-(--border) bg-(--surface) max-lg:mx-auto max-lg:w-11/12',
        className,
      )}
    >
      {type === 'default' && (
        <TemplateDetailInfo
          onClose={() => {
            setType('unset');
            setSelectedId(undefined);
          }}
          hasDelete={false}
        />
      )}
      {type === 'quickfill' && (
        <QuickfillDetailInfo
          onClose={() => {
            setType('unset');
            setSelectedId(undefined);
          }}
          hasDelete={false}
        />
      )}
      {type === 'unset' && (
        <div className='h-full content-center bg-(--muted) p-6 select-none'>
          <p className='font-noto text-center text-xl text-(--on-muted)'>
            點選上方選項卡，即可在此顯示並使用 "提示詞模板"
          </p>
        </div>
      )}
    </div>
  );
}

function InfoPanelPortal() {
  const selectedId = usePage((state) => state.selectedId);
  const setSelectedId = usePage.getState().setSelectedId;
  const type = usePage((state) => state.selectedType);
  const setType = usePage.getState().setSelectedType;

  return (
    <Dialog
      portal={
        <>
          {type === 'default' && (
            <TemplateDetailInfoPortal
              onClose={() => {
                setType('unset');
                setSelectedId(undefined);
              }}
              hasDelete={false}
            />
          )}
          {type === 'quickfill' && (
            <QuickfillDetailPortal
              onClose={() => {
                setType('unset');
                setSelectedId(undefined);
              }}
              hasDelete={false}
            />
          )}
        </>
      }
      title={'Template Detail'}
      description={'Template Detail'}
      open={!!selectedId}
      onOpenChange={(open) => {
        if (!open) {
          // when close...
          setSelectedId(undefined);
        }
      }}
    />
  );
}
