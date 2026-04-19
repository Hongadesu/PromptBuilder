import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { create } from 'zustand';
import { Trash2 } from 'lucide-react';
import { Dialog, FeedbackButton, showToast } from '@/components/global';
import { PageList } from '@/components/PageList';
import { GroupApi, PywebviewApi, TemplateApi } from '@/apis';
import { GroupTemplateItem, TemplateType } from '@/types';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

type SelectedItem = { id: string; title: string; type: TemplateType };

type SelectorState = {
  groupId: string | undefined;
  candidateList: GroupTemplateItem[];
  selectedList: SelectedItem[];
  maxPage: number;
  currPage: number;
  tabName: TemplateType;
};

type SelectorActions = {
  setGroupId: (groupId: string) => void;
  append: (item: SelectedItem) => void;
  remove: (id: string) => void;
  setTemplateMaxPage: (pageSize: number) => void;
  setQuickfillMaxPage: (pageSize: number) => void;
  setCandidateList: (items: GroupTemplateItem[]) => void;
  setSelectedList: (items: SelectedItem[]) => void;
  setTabName: (tabName: TemplateType) => void;
  switchPage: (page: number) => void;
  reset: () => void;
};

const initState: SelectorState = {
  groupId: undefined,
  candidateList: [],
  selectedList: [],
  maxPage: 20,
  currPage: 1,
  tabName: 'default',
};

const useSelector = create<SelectorState & SelectorActions>((set, get) => ({
  ...initState,
  setGroupId(groupId: string) {
    set((state) => ({ groupId }));
  },
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
  setCandidateList(items: GroupTemplateItem[]) {
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
  const groupId = useSelector((state) => state.groupId);
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
        'bg-transparent border border-[var(--border)]/50 rounded-md py-2 px-1',
        className,
      )}
    >
      <div className='h-full flex flex-col'>
        <PageList className='flex-1 min-h-52 overflow-hidden'>
          <div className='flex items-center px-2'>
            <TemplateTabs tabName={tabName} setTabName={setTabName} />
          </div>
          <PageList.ListPanel>
            {candidateList.map((item) => (
              <PageList.ListItem asChild key={item.id}>
                <li
                  className='group rounded-md p-2 cursor-pointer bg-transparent border border-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
                  onClick={() => {
                    if (!groupId) {
                      return;
                    }
                    GroupApi.addGroupTemplate({
                      templateId: item.id,
                      groupId: groupId,
                      type: item.type,
                    }).then((resp) => {
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
                  <div className='font-bold text-sm text-[var(--on-muted)] group-hover:text-[var(--on-surface)]'>
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
    <div className={cn('flex gap-2 w-fit', className)}>
      <button
        title='Default Mode'
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 px-2 rounded-md max-md:text-xs',
          tabName === 'default'
            ? 'bg-[var(--primary)] text-[var(--on-primary)]'
            : 'bg-[var(--surface)] text-[var(--on-surface)] cursor-pointer hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]',
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
          'h-8 px-2 rounded-md max-md:text-xs',
          tabName === 'quickfill'
            ? 'bg-[var(--primary)] text-[var(--on-primary)]'
            : 'bg-[var(--surface)] text-[var(--on-surface)] cursor-pointer hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]',
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
  const groupId = useSelector((state) => state.groupId);
  const selectedList = useSelector((state) => state.selectedList);
  const remove = useSelector.getState().remove;
  const setSelectedList = useSelector.getState().setSelectedList;

  useEffect(() => {
    if (groupId) {
      GroupApi.getTemplatesByGroupId(groupId).then((resp) => {
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
    }
  }, [groupId]);

  return (
    <div
      className={cn(
        'bg-transparent border border-[var(--border)]/50 rounded-md py-4 px-1 overflow-hidden',
        className,
      )}
    >
      <div
        className={cn(
          styles.surfaceScrollable,
          'relative h-full px-2 overflow-y-auto',
        )}
      >
        {selectedList.length === 0 ? (
          <div className='absolute inset-0 text-center content-center'>
            <span className='text-[var(--on-muted)]'>請選取左側模板</span>
          </div>
        ) : (
          <ul className='flex flex-col gap-2'>
            {selectedList.map((item) => (
              <li
                key={item.id}
                className='flex items-center gap-2 rounded-md p-2 border border-[var(--border)] bg-[var(--surface)]'
              >
                <div className='flex-1 text-sm font-bold text-[var(--on-surface)]'>
                  {item.title}
                </div>
                <div className='rounded-md w-fit items-center'>
                  <FeedbackButton
                    className='size-6 p-1 box-border'
                    title='取消選取'
                    type='button'
                    variant='ghostDestructive'
                    onClick={async () => {
                      if (!groupId) {
                        showToast({ type: 'error', message: '移除失敗' });
                        throw new Error('groupId 異常，移除失敗');
                      }
                      const resp = await GroupApi.deleteGroupTemplate(
                        item.id,
                        groupId,
                      );
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
    <div className='p-4 bg-[var(--surface)] border border-[var(--border)] rounded-md w-2xl max-lg:w-xl max-md:w-md'>
      <h2 className='h-12 font-bold text-xl text-[var(--on-surface)]'>
        調整群組模板
      </h2>
      <div className='flex gap-4 h-96 overflow-hidden'>
        <div className='h-full flex-1/2 flex flex-col'>
          <h3 className='text-base max-md:text-sm font-bold text-[var(--on-bg)] mb-4'>
            {'選擇要加入的模板 (可選)'}
          </h3>
          <CandidateSelector className='flex-1 overflow-hidden select-none' />
        </div>
        <div className='h-full flex-1/2 flex flex-col overflow-hidden'>
          <h3 className='text-base max-md:text-sm font-bold text-[var(--on-bg)] mb-4'>
            {'已選取的模板'}
          </h3>
          <SelectedSelector className='flex-1 select-none' />
        </div>
      </div>
    </div>
  );
}

interface GroupMemberEditorProps {
  children: ReactNode;
  groupId: string;
}

export function GroupMemberEditor({
  children,
  groupId,
}: GroupMemberEditorProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const setGroupId = useSelector.getState().setGroupId;

  useEffect(() => {
    setGroupId(groupId);
  }, [groupId]);

  return (
    <Dialog
      title='編輯群組成員'
      description='編輯群組成員'
      open={open}
      onOpenChange={(open: boolean) => {
        if (!open) {
          // when close happens
          navigate('/group');
          setOpen(open);
        } else {
          // when open happens
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
