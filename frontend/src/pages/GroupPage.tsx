import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { create } from 'zustand';
import { Undo2 } from 'lucide-react';

import { Button, Dialog } from '@/components/global';
import { PageList } from '@/components/PageList';
import {
  useGlobalStore,
  useGroupDetailStore,
  useGroupListStore,
} from '@/stores';
import { useIsTall } from '@/hooks';
import { GroupDetail } from '@/features/group/GroupDetail';
import { cn } from '@/modules/utils';

interface PageState {
  selectedId: string | undefined;
}

interface PageActions {
  setSelectedId: (selectedId: string | undefined) => void;
  reset: () => void;
}

const initPageState: PageState = {
  selectedId: undefined,
};

const usePage = create<PageState & PageActions>((set, get) => ({
  ...initPageState,
  setSelectedId(selectedId: string | undefined) {
    set(() => ({ selectedId }));
  },
  reset() {
    set(initPageState);
  },
}));

const NUM_PER_PAGE = 20;

export function GroupPage() {
  const navigate = useNavigate();
  const { isTall } = useIsTall();
  const pageReset = usePage.getState().reset;

  useEffect(() => {
    return () => pageReset();
  }, []);

  return (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-y-auto bg-(--bg) p-4 transition-all duration-500'>
      {isTall && (
        <div className='mx-4 mt-4 flex gap-2 max-lg:mx-auto max-lg:w-11/12'>
          <h1 className='text-2xl font-extrabold text-(--on-bg-title)'>群組</h1>
          <Button
            title='上一頁'
            type='button'
            variant='outline'
            className='ml-auto box-border size-8'
            onClick={() => navigate(-1)}
          >
            <Undo2 />
          </Button>
          <Button
            variant='secondary'
            className='h-8 px-2'
            onClick={() => navigate('/group/create')}
          >
            新增群組
          </Button>
        </div>
      )}
      <GroupListPanel className='flex-2/3 overflow-hidden' />
      {isTall ? (
        <InfoPanel className='flex-1/3 overflow-hidden' />
      ) : (
        <InfoPanelPortal />
      )}
    </div>
  );
}

function GroupListPanel({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const currPage = Number(query.get('page')) || 1;
  const setGroupItem = useGroupDetailStore.getState().setGroupItem;
  const groupList = useGroupListStore((state) => state.groupList);
  const maxPage = useGroupListStore((state) => state.maxPage);

  const selectedId = usePage((state) => state.selectedId);
  const setSelectedId = usePage.getState().setSelectedId;

  useEffect(() => {
    useGlobalStore.getState().getGroups(currPage, NUM_PER_PAGE);
  }, [currPage]);

  useEffect(() => {
    useGlobalStore.getState().setQuickfillMaxPage(NUM_PER_PAGE);
  }, [groupList]);

  const switchPage = (page: number) => {
    query.set('page', String(page));
    navigate(
      {
        pathname: location.pathname,
        search: `?${query.toString()}`,
      },
      { replace: true },
    );
  };

  return (
    <div
      className={cn(
        'mx-4 rounded-md border border-(--border) bg-(--surface) p-2 max-lg:mx-auto max-lg:w-11/12',
        className,
      )}
    >
      <PageList>
        <PageList.Header>我的群組</PageList.Header>
        {groupList.length !== 0 ? (
          <PageList.GridPanel>
            {groupList.map((item) => {
              const isActive = selectedId === item.groupId;

              return (
                <PageList.GridItem asChild key={item.groupId}>
                  <li
                    className={cn(
                      'group border p-4 select-none',
                      isActive
                        ? 'border-(--secondary) bg-(--secondary)'
                        : 'border-(--border) bg-(--surface)',
                    )}
                    onClick={() => {
                      setSelectedId(item.groupId);
                      setGroupItem(item);
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
                      {item.group}
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
                </PageList.GridItem>
              );
            })}
          </PageList.GridPanel>
        ) : (
          <div
            className='group h-full w-full cursor-pointer content-center rounded-lg border border-(--on-muted) px-2 transition-colors duration-500 select-none hover:bg-(--secondary)/30'
            onClick={() => navigate('/group/create')}
          >
            <p className='font-noto text-center text-xl text-(--on-muted) transition-colors duration-500 group-hover:text-(--on-secondary)'>
              沒有任何群組，前往新增群組
            </p>
          </div>
        )}
        <PageList.SwitchPanel
          currPage={currPage}
          maxPage={maxPage}
          switchPage={switchPage}
        />
      </PageList>
    </div>
  );
}

function InfoPanel({ className }: { className?: string }) {
  const id = useGroupDetailStore((state) => state.groupId);
  const setSelectedId = usePage.getState().setSelectedId;

  return (
    <div
      className={cn(
        'mx-4 overflow-y-auto rounded-md border border-(--border) bg-(--surface) max-lg:mx-auto max-lg:w-11/12',
        className,
      )}
    >
      {id ? (
        <GroupDetail className='mx-0 flex h-full flex-col gap-4 border-0 p-4'>
          <header className='flex items-center gap-2'>
            <GroupDetail.Title />
            <GroupDetail.ButtonSetB
              className='ml-auto'
              onCancel={() => setSelectedId(undefined)}
              onDeleteEffect={() => setSelectedId(undefined)}
            />
          </header>
          <GroupDetail.Description />
        </GroupDetail>
      ) : (
        <div className='h-full content-center bg-(--muted) p-6 select-none'>
          <p className='font-noto text-center text-xl text-(--on-muted)'>
            點選上方選項卡，即可在此顯示 "群組相關訊息"
          </p>
        </div>
      )}
    </div>
  );
}

function InfoPanelPortal() {
  const selectedId = usePage((state) => state.selectedId);
  const setSelectedId = usePage.getState().setSelectedId;

  return (
    <Dialog
      portal={
        <GroupDetail className='flex min-h-48 w-xl flex-col gap-4 p-4 max-lg:w-md max-md:w-sm'>
          <header className='flex items-center gap-2'>
            <GroupDetail.Title />
            <GroupDetail.ButtonSetB
              className='ml-auto'
              onCancel={() => setSelectedId(undefined)}
              onDeleteEffect={() => setSelectedId(undefined)}
            />
          </header>
          <GroupDetail.Description />
        </GroupDetail>
      }
      title={'Group Detail'}
      description={'Group Detail'}
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
