import { ReactNode, useEffect, useState } from 'react';
import { create } from 'zustand';
import { Trash2 } from 'lucide-react';
import { Dialog, FeedbackButton, showToast } from '@/components/global';
import { PageList } from '@/components/PageList';
import { PinApi, TemplateApi, PywebviewApi } from '@/apis';
import { PinTemplateItem, TemplateType } from '@/types';
import { useGlobalStore, useSideStateStore } from '@/stores';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

type SelectedItem = { id: string; title: string; type: TemplateType };

type SelectorState = {
  candidateList: PinTemplateItem[];
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
  setCandidateList: (items: PinTemplateItem[]) => void;
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
  setCandidateList(items: PinTemplateItem[]) {
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
      useSelector.getState().setTemplateMaxPage(numPerPage);
    } else if (tabName === 'quickfill') {
      useSelector.getState().setQuickfillMaxPage(numPerPage);
    }
  }, [tabName]);

  return (
    <div
      className={cn(
        'rounded-md border border-[var(--border)]/50 bg-transparent px-1 py-2',
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
                  className='group cursor-pointer rounded-md border border-[var(--muted)] bg-transparent p-2 hover:border-[var(--border)] hover:bg-[var(--surface)]'
                  onClick={() => {
                    PinApi.addPinTemplate(item.id, item.type).then((resp) => {
                      if (resp.status !== 'success') {
                        showToast({ type: 'error', message: '添加失敗' });
                        return;
                      }
                      showToast({ type: 'success', message: '添加成功' });
                      append({
                        id: item.id,
                        title: item.title,
                        type: item.type,
                      });
                    });
                  }}
                >
                  <div className='text-sm font-bold text-[var(--on-muted)] group-hover:text-[var(--on-surface)]'>
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

const SelectedTab = 'bg-[var(--primary)] text-[var(--on-primary)]';
const UnselectedTab =
  'bg-[var(--surface)] text-[var(--on-surface)] cursor-pointer hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]';

function TemplateTabs({
  className,
  tabName,
  setTabName,
}: {
  className?: string;
  tabName: TemplateType;
  setTabName: (tabName: TemplateType) => void;
}) {
  return (
    <div className={cn('flex w-fit gap-2', className)}>
      <button
        title='Default Mode'
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 rounded-md px-2 max-md:text-xs',
          tabName === 'default' ? SelectedTab : UnselectedTab,
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
          tabName === 'quickfill' ? SelectedTab : UnselectedTab,
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
  const setSelectedList = useSelector.getState().setSelectedList;

  useEffect(() => {
    PinApi.getPinTemplates().then((resp) => {
      if (resp.status !== 'success') {
        return;
      }
      setSelectedList(
        resp.templates.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
        })),
      );
    });
  }, []);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-[var(--border)]/50 bg-transparent px-1 py-4',
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
            <span className='text-[var(--on-muted)]'>請選取左側模板</span>
          </div>
        ) : (
          <ul className='flex flex-col gap-2'>
            {selectedList.map((item) => (
              <li
                key={item.id}
                className='flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2'
              >
                <div className='flex-1 text-sm font-bold text-[var(--on-surface)]'>
                  {item.title}
                </div>
                <div className='w-fit items-center rounded-md'>
                  <FeedbackButton
                    className='box-border size-6 p-1'
                    title='取消選取'
                    type='button'
                    variant='ghostDestructive'
                    onClick={async () => {
                      const resp = await PinApi.deletePinTemplate(item.id);
                      if (resp.status !== 'success') {
                        showToast({ type: 'error', message: '移除失敗' });
                        throw new Error('移除失敗');
                      }
                      showToast({ type: 'success', message: '移除成功' });
                      remove(item.id);
                    }}
                  >
                    <Trash2 />
                  </FeedbackButton>
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
    <div className='w-2xl rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 max-lg:w-xl max-md:w-md'>
      <h2 className='h-12 text-xl font-bold text-[var(--on-surface)]'>
        調整釘選模板
      </h2>
      <div className='flex h-96 gap-4 overflow-hidden'>
        <div className='flex h-full flex-1/2 flex-col'>
          <h3 className='mb-4 text-base font-bold text-[var(--on-bg)] max-md:text-sm'>
            {'選擇要釘選的模板'}
          </h3>
          <CandidateSelector className='flex-1 overflow-hidden select-none' />
        </div>
        <div className='flex h-full flex-1/2 flex-col overflow-hidden'>
          <h3 className='mb-4 text-base font-bold text-[var(--on-bg)] max-md:text-sm'>
            {'已選取的模板'}
          </h3>
          <SelectedSelector className='flex-1 select-none' />
        </div>
      </div>
    </div>
  );
}

interface PinMemberEditorProps {
  children: ReactNode;
}

export function PinMemberEditor({ children }: PinMemberEditorProps) {
  const getPinTemplates = useGlobalStore.getState().getPinTemplates;
  const setSideOpen = useSideStateStore.getState().setSideOpen;
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      title='編輯釘選成員'
      description='編輯釘選成員'
      open={open}
      onOpenChange={(open: boolean) => {
        if (!open) {
          // when close happens
          setSideOpen(true);
          getPinTemplates();
          setOpen(open);
        } else {
          // when open happens
          setSideOpen(false);
          PywebviewApi.resizeMinWindow(532, 532);
          setOpen(open);
        }
      }}
      portal={<Portal />}
      hasClose
    >
      {children}
    </Dialog>
  );
}
