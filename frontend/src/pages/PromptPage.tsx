import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { create } from 'zustand';
import { Undo2 } from 'lucide-react';

import { Button, Dialog } from '@/components/global';
import { PageList } from '@/components/PageList';
import { TemplateDetailInfo } from '@/features/default/TemplateDetailInfo';
import { TemplateDetailInfoPortal } from '@/features/default/TemplateDetailPortal';
import {
  useGlobalStore,
  useTemplateListStore,
  useTemplateDetailStore,
} from '@/stores';
import { useIsTall } from '@/hooks';
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

export function PromptPage() {
  const navigate = useNavigate();
  const pageReset = usePage.getState().reset;

  const { isTall } = useIsTall();

  useEffect(() => {
    return () => pageReset();
  }, []);

  return (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-y-auto bg-(--bg) p-4 transition-all duration-500'>
      {isTall && (
        <div className='mx-4 mt-4 flex gap-2 max-lg:mx-auto max-lg:w-11/12'>
          <h1 className='text-2xl font-extrabold text-(--on-bg-title)'>
            提示詞模板
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
          <Button
            variant='secondary'
            className='h-8 px-2'
            onClick={() => navigate('/test/default')}
          >
            新增模板
          </Button>
        </div>
      )}
      <TemplateListPanel className='flex-1 overflow-hidden' />
      {isTall ? (
        <InfoPanel className='flex-1 overflow-hidden' />
      ) : (
        <InfoPanelPortal />
      )}
    </div>
  );
}

function TemplateListPanel({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const currPage = Number(query.get('page')) || 1;
  const maxPage = useTemplateListStore((state) => state.maxPage);
  const templateList = useTemplateListStore((state) => state.templateList);
  const setDetail = useTemplateDetailStore.getState().setDetail;

  const selectedId = usePage((state) => state.selectedId);
  const setSelectedId = usePage.getState().setSelectedId;

  useEffect(() => {
    useGlobalStore.getState().getTemplates(currPage, NUM_PER_PAGE);
  }, [currPage]);

  useEffect(() => {
    useGlobalStore.getState().setTemplateMaxPage(NUM_PER_PAGE);
  }, [templateList]);

  const switchPage = (page: number) => {
    // 設定或更新 page 參數
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
        <PageList.Header>我的提示詞模板</PageList.Header>
        {templateList.length !== 0 ? (
          <PageList.GridPanel>
            {templateList.map((item) => {
              const isActive = selectedId === item.id;
              return (
                <PageList.GridItem asChild key={item.id}>
                  <li
                    className={cn(
                      'group border p-4 select-none',
                      isActive
                        ? 'border-(--secondary) bg-(--secondary)'
                        : 'border-(--border) bg-(--surface)',
                    )}
                    onClick={() => {
                      setSelectedId(item.id);
                      setDetail(item);
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
                </PageList.GridItem>
              );
            })}
          </PageList.GridPanel>
        ) : (
          <div className='h-full w-full content-center rounded-lg border border-(--on-muted) px-2 text-xl select-none'>
            <p className='font-noto text-center text-(--on-muted)'>
              沒有任何模板
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
  const id = useTemplateDetailStore((state) => state.id);
  const setSelectedId = usePage.getState().setSelectedId;

  return (
    <div
      className={cn(
        'mx-4 overflow-y-auto rounded-md border border-(--border) bg-(--surface) max-lg:mx-auto max-lg:w-11/12',
        className,
      )}
    >
      {id ? (
        <TemplateDetailInfo onClose={() => setSelectedId(undefined)} />
      ) : (
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

  return (
    <Dialog
      portal={
        <TemplateDetailInfoPortal
          onClose={() => setSelectedId(undefined)}
          hasDelete={true}
        />
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
