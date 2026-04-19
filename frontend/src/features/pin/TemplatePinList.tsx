import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { HoverCard } from 'radix-ui';
import { Pin, Trash2 } from 'lucide-react';
import { Button, showToast } from '@/components/global';
import { VirtualList } from '@/components/VirtualList';
import { PinMemberEditor } from './PinMemberEditor';
import {
  useTemplatePinStore as useStore,
  usePromptEditorStore,
  useGlobalStore,
  useQuickfillEditorStore,
} from '@/stores';
import { cn } from '@/modules/utils';

const rowHeight = 32;
const ctrHeight = 32 * 12;

export function TemplatePinList({ className }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const templateList = useStore((state) => state.templateList);
  const setBasicEditor = usePromptEditorStore.getState().setEditor;
  const setQuickfillEditor = useQuickfillEditorStore.getState().setEditor;
  const getPinTemplates = useGlobalStore.getState().getPinTemplates;

  useEffect(() => {
    getPinTemplates();
  }, []);

  return (
    <div className={cn('flex flex-col gap-2.5 pr-2', className)}>
      <div className='flex gap-2 item-center text-[var(--on-sidebar)]'>
        <span className='text-lg font-bold'>我的釘選</span>
        <div className='flex items-center justify-center'>
          <Pin className='size-4' />
        </div>
      </div>
      <div className='flex-1 bg-transparent border border-[var(--border)]/50 rounded-md py-2 px-1'>
        {templateList.length === 0 ? (
          <PinMemberEditor>
            <div
              style={{ height: ctrHeight }}
              className='group h-full rounded-md mx-1 content-center cursor-pointer transition-colors duration-500 bg-transparent hover:bg-[var(--secondary)]/50'
            >
              <p className='px-8 transition-colors duration-500 text-[var(--border)] group-hover:text-[var(--on-secondary)]'>
                沒有任何釘選模板，點此加入
              </p>
            </div>
          </PinMemberEditor>
        ) : (
          <VirtualList
            data={templateList}
            rowHeight={rowHeight}
            containerHeight={ctrHeight}
            overscanCount={5}
            renderRow={(item, i) => (
              <li key={i}>
                <TemplateHoverCard
                  trigger={
                    <div
                      style={{ height: rowHeight }}
                      className='group relative flex items-center px-1.5 py-1 rounded-md cursor-pointer text-[var(--on-sidebar)] hover:text-[var(--on-secondary)] hover:bg-[var(--secondary)]'
                      onClick={() => {
                        const path = location.pathname;
                        switch (path) {
                          case '/test/default':
                            setBasicEditor(item.template, item.param);
                            break;
                          case '/test/quickfill':
                            setQuickfillEditor(item.template, item.param);
                            break;
                          default:
                            if (item.type === 'default') {
                              navigate(`/prompt/${item.id}`);
                            } else {
                              navigate(`/quickfill/${item.id}`);
                            }
                            break;
                        }
                      }}
                    >
                      <div className='w-full text-sm overflow-hidden whitespace-nowrap overflow-ellipsis'>
                        {item.title}
                      </div>
                      {/* 按鈕組合 */}
                      <div className='absolute hidden top-0 right-0 h-full w-fit p-1 items-center gap-1 group-hover:flex'>
                        <Button
                          title='移除釘選'
                          type='button'
                          variant='ghostDestructive'
                          className='size-6 p-1 box-border'
                          onClick={(e) =>
                            (async () => {
                              e.stopPropagation();
                              const success = await useGlobalStore
                                .getState()
                                .removePinTemplateItem(item.id);
                              if (!success) {
                                showToast({
                                  type: 'error',
                                  message: '移除失敗',
                                });
                                return;
                              }
                              showToast({
                                type: 'success',
                                message: '移除成功',
                              });
                            })()
                          }
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  }
                  content={
                    <div className='max-w-48 content-center p-2 rounded-lg bg-[var(--tooltip)]'>
                      <span className='line-clamp-3 text-[var(--on-tooltip)] font-bold text-xs'>
                        {item.description ? item.description : '(無)'}
                      </span>
                    </div>
                  }
                />
              </li>
            )}
          />
        )}
      </div>
    </div>
  );
}

function TemplateHoverCard({
  trigger,
  content,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content side='right' className='z-10'>
          {content}
          <HoverCard.Arrow className='fill-[var(--tooltip)]' />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
