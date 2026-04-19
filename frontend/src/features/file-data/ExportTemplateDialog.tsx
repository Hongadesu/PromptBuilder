import { useEffect } from 'react';
import { create } from 'zustand';
import { Trash2 } from 'lucide-react';

import { Button, Dialog, FeedbackButton, showToast } from '@/components/global';
import { PageList } from '@/components/PageList';
import { PywebviewApi, TemplateApi } from '@/apis';
import { TemplateItem, TemplateType, TemplateSelectedItem } from '@/types';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

type SelectedItem = TemplateSelectedItem;

type SelectorState = {
  candidateList: TemplateItem[];
  selectedList: SelectedItem[];
  maxPage: number;
  currPage: number;
  tabName: TemplateType;
};

type SelectorActions = {
  append: (item: SelectedItem) => void;
  remove: (id: string) => void;
  setTemplateMaxPage: (pageSize: number) => void;
  setQuickfillMaxPage: (pageSize: number) => void;
  setCandidateList: (items: TemplateItem[]) => void;
  setSelectedList: (items: SelectedItem[]) => void;
  setTabName: (tabName: TemplateType) => void;
  switchPage: (page: number) => void;
  reset: () => void;
};

const initState: SelectorState = {
  candidateList: [],
  selectedList: [],
  maxPage: 20,
  currPage: 1,
  tabName: 'default',
};

const useSelector = create<SelectorState & SelectorActions>((set, get) => ({
  ...initState,
  append(item: SelectedItem) {
    if (!get().selectedList.some((i) => i.id === item.id)) {
      set((state) => ({ selectedList: [...state.selectedList, item] }));
    }
  },
  remove(id: string) {
    set((state) => ({
      selectedList: state.selectedList.filter((item) => item.id !== id),
    }));
  },
  async setTemplateMaxPage(pageSize: number) {
    {
      if (pageSize <= 0) {
        throw new Error('pageSize 必須大於 0');
      }
      const resp = await TemplateApi.getTemplateTotal();
      if (resp.status !== 'success') {
        throw new Error('總數獲取失敗');
      }
      let maxPage = Math.ceil(resp.total / pageSize);
      if (maxPage === 0) {
        maxPage = 1;
      }
      set((state) => ({ maxPage, currPage: 1 }));
    }
  },
  async setQuickfillMaxPage(pageSize: number) {
    if (pageSize <= 0) {
      throw new Error('pageSize 必須大於 0');
    }
    const resp = await TemplateApi.getQuickfillTemplateTotal();
    if (resp.status !== 'success') {
      throw new Error('總數獲取失敗');
    }
    let maxPage = Math.ceil(resp.total / pageSize);
    if (maxPage === 0) {
      maxPage = 1;
    }
    set((state) => ({ maxPage, currPage: 1 }));
  },
  setTabName(tabName: TemplateType) {
    set((state) => ({ tabName }));
  },
  switchPage: (page: number) => {
    set((state) => ({ currPage: page }));
  },
  setCandidateList(items: TemplateItem[]) {
    set((state) => ({ candidateList: items }));
  },
  setSelectedList(items: SelectedItem[]) {
    set((state) => ({ selectedList: items }));
  },
  reset() {
    set(initState);
  },
}));

const numPerPage = 20;

function CandidateSelector({ className }: { className?: string }) {
  const candidateList = useSelector((state) => state.candidateList);
  const setCandidateList = useSelector.getState().setCandidateList;
  const setTemplateMaxPage = useSelector.getState().setTemplateMaxPage;
  const setQuickfillMaxPage = useSelector.getState().setQuickfillMaxPage;

  const append = useSelector.getState().append;
  const tabName = useSelector((state) => state.tabName);
  const setTabName = useSelector.getState().setTabName;
  const maxPage = useSelector((state) => state.maxPage);
  const currPage = useSelector((state) => state.currPage);
  const switchPage = useSelector.getState().switchPage;

  // 更新 candidateList
  useEffect(() => {
    if (tabName === 'default') {
      TemplateApi.getTemplates({ page: currPage, pageSize: numPerPage }).then(
        (resp) => {
          if (resp.status !== 'success') {
            return;
          }
          setCandidateList(
            resp.templates.map((template) => ({
              type: 'default',
              ...template,
            })),
          );
        },
      );
    } else {
      TemplateApi.getQuickfillTemplates({
        page: currPage,
        pageSize: numPerPage,
      }).then((resp) => {
        if (resp.status !== 'success') {
          return;
        }
        setCandidateList(
          resp.templates.map((template) => ({
            type: 'quickfill',
            ...template,
          })),
        );
      });
    }
  }, [tabName, currPage]);

  // 更新 maxPage
  useEffect(() => {
    if (tabName === 'default') {
      setTemplateMaxPage(numPerPage);
    } else if (tabName === 'quickfill') {
      setQuickfillMaxPage(numPerPage);
    }
  }, [tabName]);

  return (
    <div
      className={cn(
        'rounded-md border border-(--border)/50 bg-transparent px-1 py-2',
        className,
      )}
    >
      <div className='flex h-full flex-col'>
        <PageList className='min-h-52 flex-1 overflow-hidden'>
          <div className='flex items-center px-2'>
            <TemplateTabs tabName={tabName} setTabName={setTabName} />
          </div>
          <PageList.ListPanel>
            {candidateList.map((item) => (
              <PageList.ListItem asChild key={item.id}>
                <li
                  className='group cursor-pointer rounded-md border border-(--muted) bg-transparent p-2 hover:border-(--border) hover:bg-(--surface)'
                  onClick={() =>
                    append({
                      id: item.id,
                      title: item.title,
                      type: item.type,
                    })
                  }
                >
                  <div className='text-sm font-bold text-(--on-muted) group-hover:text-(--on-surface)'>
                    {item.title}
                  </div>
                </li>
              </PageList.ListItem>
            ))}
          </PageList.ListPanel>
          <PageList.SwitchPanelSmall
            currPage={currPage}
            maxPage={maxPage}
            switchPage={switchPage}
          />
        </PageList>
      </div>
    </div>
  );
}

type TemplateTabsProps = {
  className?: string;
  tabName: TemplateType;
  setTabName: (tabName: TemplateType) => void;
};

function TemplateTabs({ className, tabName, setTabName }: TemplateTabsProps) {
  return (
    <div className={cn('flex w-fit gap-2', className)}>
      <button
        title='Default Mode'
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 rounded-md px-2 max-md:text-xs',
          tabName === 'default'
            ? 'bg-(--primary) text-(--on-primary)'
            : 'cursor-pointer bg-(--surface) text-(--on-surface) hover:bg-(--secondary) hover:text-(--on-secondary)',
        )}
        onClick={() => {
          if (tabName === 'default') {
            return;
          }
          setTabName('default');
        }}
      >
        Default
      </button>
      <button
        title='Quickfill Mode'
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 rounded-md px-2 max-md:text-xs',
          tabName === 'quickfill'
            ? 'bg-(--primary) text-(--on-primary)'
            : 'cursor-pointer bg-(--surface) text-(--on-surface) hover:bg-(--secondary) hover:text-(--on-secondary)',
        )}
        onClick={() => {
          if (tabName === 'quickfill') {
            return;
          }
          setTabName('quickfill');
        }}
      >
        Quick
      </button>
    </div>
  );
}

function SelectedSelector({ className }: { className?: string }) {
  const selectedList = useSelector((state) => state.selectedList);
  const remove = useSelector.getState().remove;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-(--border)/50 bg-transparent px-1 py-4',
        className,
      )}
    >
      <div
        className={cn(
          styles.surfaceScrollable,
          'relative h-full overflow-y-auto px-2',
        )}
      >
        {selectedList.length === 0 ? (
          <div className='absolute inset-0 content-center text-center'>
            <span className='text-(--on-muted)'>請選取左側模板</span>
          </div>
        ) : (
          <ul className='flex flex-col gap-2'>
            {selectedList.map((item) => (
              <li
                key={item.id}
                className='flex items-center gap-2 rounded-md border border-(--border) bg-(--surface) p-2'
              >
                <div className='flex-1 text-sm font-bold text-(--on-surface)'>
                  {item.title}
                </div>
                <div className='w-fit items-center rounded-md'>
                  <Button
                    className='box-border size-6 p-1'
                    title='取消選取'
                    type='button'
                    variant='ghostDestructive'
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Portal() {
  return (
    <div className='w-2xl rounded-md border border-(--border) bg-(--surface) p-4 max-lg:w-xl max-md:w-md'>
      <h2 className='h-12 text-xl font-bold text-(--on-surface)'>匯出模板</h2>
      <div className='flex h-96 gap-4 overflow-hidden'>
        <div className='flex h-full flex-1/2 flex-col'>
          <h3 className='mb-4 text-base font-bold text-(--on-bg) max-md:text-sm'>
            {'選擇要匯出的模板'}
          </h3>
          <CandidateSelector className='flex-1 overflow-hidden select-none' />
        </div>
        <div className='flex h-full flex-1/2 flex-col overflow-hidden'>
          <h3 className='mb-4 text-base font-bold text-(--on-bg) max-md:text-sm'>
            {'已選取的模板'}
          </h3>
          <SelectedSelector className='flex-1 select-none' />
        </div>
      </div>
      <div className='flex pt-4'>
        <FeedbackButton
          className='ml-auto px-2'
          onClick={async () => {
            const selectedList = useSelector.getState().selectedList;
            try {
              const result = await PywebviewApi.exportAppData({
                type: 'template-or-quickfill',
                items: selectedList,
              });
              switch (result.status) {
                case 'success':
                  showToast({ type: 'success', message: '導出成功' });
                  break;

                case 'canceled':
                  showToast({ type: 'info', message: '取消導出' });
                  break;

                case 'failed':
                  showToast({ type: 'error', message: '導出失敗' });
                  break;
              }
            } catch (error) {
              showToast({ type: 'error', message: '導出失敗' });
            }
          }}
        >
          確定
        </FeedbackButton>
      </div>
    </div>
  );
}

type ExportTemplateDialogProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

export function ExportTemplateDialog({
  open,
  setOpen,
}: ExportTemplateDialogProps) {
  const reset = useSelector.getState().reset;

  return (
    <Dialog
      title='編輯匯出模板成員'
      description='編輯匯出模板成員'
      open={open}
      onOpenChange={(open: boolean) => {
        if (!open) {
          // when close happens
          reset();
          setOpen(open);
        } else {
          // when open happens
          PywebviewApi.resizeMinWindow(532, 532);
          setOpen(open);
        }
      }}
      portal={<Portal />}
      hasClose
    />
  );
}
