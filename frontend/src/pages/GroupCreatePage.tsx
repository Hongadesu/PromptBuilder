import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Label } from 'radix-ui';
import { Trash2, Undo2 } from 'lucide-react';

import { Button, FeedbackButton, showToast } from '@/components/global';
import { PageList } from '@/components/PageList';
import { GroupApi, PywebviewApi, TemplateApi } from '@/apis';
import { GroupData, GroupTemplateItem, TemplateType } from '@/types';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

export function GroupCreatePage() {
  const navigate = useNavigate();
  const { selectedTemplateList, appendSelectedTempate, removeSelectedTempate } =
    useSelectTemplateList();
  const groupNameRef = useRef<HTMLInputElement | null>(null);
  const groupDescriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    PywebviewApi.resizeMinWindow(768, 732);
  }, []);

  return (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-y-auto bg-(--bg) p-4 transition-all duration-500'>
      <div className='mx-4 mt-4 flex gap-2 max-lg:mx-auto max-lg:w-11/12'>
        <h1 className='text-2xl font-extrabold text-(--on-bg-title)'>
          新增群組
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
      </div>
      <div className='mx-4 grid grid-cols-[max-content_1fr] gap-6 max-lg:mx-auto max-lg:w-11/12'>
        <Label.Root
          htmlFor='groupNameInput'
          className='text-lg font-bold text-(--on-bg)'
        >
          群組名稱
        </Label.Root>
        <input
          ref={groupNameRef}
          id='groupNameInput'
          tabIndex={0}
          className='min-w-24 resize-none rounded-md border border-(--border) bg-(--bg) p-2 text-sm text-(--on-bg) focus-visible:border-(--primary) focus-visible:outline-1 focus-visible:outline-(--primary)'
          spellCheck={false}
        />
        <Label.Root
          htmlFor='groupDescriptionInput'
          className='text-lg font-bold text-(--on-bg)'
        >
          群組描述
        </Label.Root>
        <textarea
          ref={groupDescriptionRef}
          id='groupDescriptionInput'
          tabIndex={0}
          className='h-24 min-w-24 resize-none rounded-md border border-(--border) bg-(--bg) p-2 text-sm text-(--on-bg) focus-visible:border-(--primary) focus-visible:outline-1 focus-visible:outline-(--primary)'
          spellCheck={false}
        />
      </div>
      <div className='mx-4 flex flex-1 gap-4 overflow-hidden max-lg:mx-auto max-lg:w-11/12'>
        <div className='flex h-full flex-1/2 flex-col'>
          <h3 className='mb-4 text-lg font-bold text-(--on-bg)'>
            {'選擇要加入的模板 (可選)'}
          </h3>
          <TemplateList
            className='flex-1 overflow-hidden select-none'
            appendSelectedTempate={appendSelectedTempate}
          />
        </div>
        <div className='flex h-full flex-1/2 flex-col overflow-hidden'>
          <h3 className='mb-4 text-lg font-bold text-(--on-bg)'>
            {'已選取的模板'}
          </h3>
          <TemplateListSelected
            className='flex-1 select-none'
            selectedTemplateList={selectedTemplateList}
            removeSelectedTempate={removeSelectedTempate}
          />
        </div>
      </div>
      <div className='mb-4 flex justify-center gap-4'>
        <Button
          title='取消'
          type='button'
          variant='outline'
          className='h-8 px-2'
          onClick={() => navigate(-1)}
        >
          取消
        </Button>
        <FeedbackButton
          title='確認'
          type='button'
          variant='default'
          className='h-8 px-2'
          onClick={async () => {
            if (!groupNameRef.current || !groupDescriptionRef.current) {
              return;
            }
            const groupName = groupNameRef.current.value.trim();
            if (!groupName) {
              showToast({ type: 'error', message: '群組名稱為必填' });
              throw new Error('群組名稱為必填');
            }
            const group: Omit<GroupData, 'groupId'> = {
              group: groupName,
              description: groupDescriptionRef.current.value || '無',
            };
            const groupTemplates = selectedTemplateList.map((item) => ({
              templateId: item.id,
              type: item.type,
            }));
            const resp = await GroupApi.addGroup(group, groupTemplates);
            if (resp.status !== 'success') {
              showToast({ type: 'error', message: '加入失敗' });
              throw new Error('加入失敗');
            }
            showToast({ type: 'success', message: '加入成功' });
            navigate('/group', { replace: true });
          }}
        >
          確認
        </FeedbackButton>
      </div>
    </div>
  );
}

type SelectedTemplate = { id: string; title: string; type: TemplateType };

function useSelectTemplateList() {
  const [selectedTemplateList, setSelectedTemplateList] = useState<
    SelectedTemplate[]
  >([]);

  const appendSelectedTempate = (item: SelectedTemplate) => {
    if (!selectedTemplateList.some((i) => i.id === item.id)) {
      setSelectedTemplateList((prev) => [...prev, item]);
    }
  };

  const removeSelectedTempate = (id: string) => {
    setSelectedTemplateList((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    selectedTemplateList,
    appendSelectedTempate,
    removeSelectedTempate,
  };
}

const numPerPage = 20;

async function getTemplateMaxPage(pageSize: number) {
  if (pageSize <= 0) {
    throw new Error('pageSize 必須大於 0');
  }
  const resp = await TemplateApi.getTemplateTotal();
  if (resp.status !== 'success') {
    return;
  }
  let maxPage = Math.ceil(resp.total / pageSize);
  if (maxPage === 0) {
    maxPage = 1;
  }
  return maxPage;
}

async function getQuickfillMaxPage(pageSize: number) {
  if (pageSize <= 0) {
    throw new Error('pageSize 必須大於 0');
  }
  const resp = await TemplateApi.getQuickfillTemplateTotal();
  if (resp.status !== 'success') {
    return;
  }
  let maxPage = Math.ceil(resp.total / pageSize);
  if (maxPage === 0) {
    maxPage = 1;
  }
  return maxPage;
}

function TemplateList({
  className,
  appendSelectedTempate,
}: {
  appendSelectedTempate: (item: SelectedTemplate) => void;
  className?: string;
}) {
  const [templateList, setTemplateList] = useState<GroupTemplateItem[]>([]);

  const [tabName, setTabName] = useState<TemplateType>('default');
  const [maxPage, setMaxPage] = useState(1);
  const [currPage, setCurrPage] = useState(1);

  const switchPage = (page: number) => {
    setCurrPage(page);
  };

  // 更新 templateList
  useEffect(() => {
    if (tabName === 'default') {
      TemplateApi.getTemplates({ page: currPage, pageSize: numPerPage }).then(
        (resp) => {
          if (resp.status !== 'success') {
            return;
          }
          setTemplateList(
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
        setTemplateList(
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
      getTemplateMaxPage(numPerPage).then((maxPage) => {
        if (!maxPage) {
          return;
        }
        setMaxPage(maxPage);
        setCurrPage(1);
      });
    } else if (tabName === 'quickfill') {
      getQuickfillMaxPage(numPerPage).then((maxPage) => {
        if (!maxPage) {
          return;
        }
        setMaxPage(maxPage);
        setCurrPage(1);
      });
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
            <PageList.Header className='text-base max-sm:hidden'>
              我的模板
            </PageList.Header>
            <TemplateTabs
              className='max-sm:ml-0'
              tabName={tabName}
              setTabName={setTabName}
            />
          </div>
          <PageList.ListPanel>
            {templateList.map((item) => (
              <PageList.ListItem asChild key={item.id}>
                <li
                  className='group cursor-pointer rounded-md border border-(--muted) bg-transparent p-2 hover:border-(--border) hover:bg-(--surface)'
                  onClick={() =>
                    appendSelectedTempate({
                      id: item.id,
                      title: item.title,
                      type: item.type,
                    })
                  }
                >
                  <div className='font-bold text-(--on-muted) group-hover:text-(--on-surface)'>
                    {item.title}
                  </div>
                </li>
              </PageList.ListItem>
            ))}
          </PageList.ListPanel>
          <PageList.SwitchPanel
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
    <div className={cn('ml-auto flex w-fit gap-2', className)}>
      <button
        title='Default Mode'
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 rounded-md px-2',
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
          'h-8 rounded-md px-2',
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

function TemplateListSelected({
  className,
  selectedTemplateList,
  removeSelectedTempate,
}: {
  selectedTemplateList: SelectedTemplate[];
  removeSelectedTempate: (id: string) => void;
  className?: string;
}) {
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
        {selectedTemplateList.length === 0 ? (
          <div className='absolute inset-0 content-center text-center'>
            <span className='text-(--on-muted)'>請選取左側模板</span>
          </div>
        ) : (
          <ul className='flex flex-col gap-2'>
            {selectedTemplateList.map((item) => (
              <li
                key={item.id}
                className='flex items-center gap-2 rounded-md border border-(--border) bg-(--surface) p-2'
              >
                <div className='flex-1 font-bold text-(--on-surface)'>
                  {item.title}
                </div>
                <div className='w-fit items-center rounded-md'>
                  <Button
                    className='box-border size-7 p-1'
                    title='取消選取'
                    type='button'
                    variant='ghostDestructive'
                    onClick={() => removeSelectedTempate(item.id)}
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
