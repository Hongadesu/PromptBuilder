import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Label } from 'radix-ui';
import { Info, Plus, ScanText, Undo2 } from 'lucide-react';

import { useGlobalStore, usePromptEditorStore as useStore } from '@/stores';
import { PywebviewApi } from '@/apis';
import {
  Button,
  FeedbackButton,
  Tooltip,
  Dialog,
  showToast,
} from '@/components/global';
import { GenerateBtn, KeyInput, SaveBtn } from '@/components/prompt-test';
import { useIsTall } from '@/hooks';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

/* 提示詞模板新增/測試頁面 */
export function PromptTestPage({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const generate = useStore.getState().generate;
  const reset = useStore.getState().reset;
  const { isTall } = useIsTall();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto bg-(--bg) transition-all duration-500',
        className,
      )}
    >
      <div className='relative mx-auto flex h-full min-h-96 w-5/6 flex-col py-6'>
        <div
          className={cn(
            'mb-4 flex w-full gap-2',
            !isTall && 'absolute top-7 left-0',
          )}
        >
          {isTall && (
            <h1 className='text-2xl font-extrabold text-(--on-bg-title)'>
              提示詞模板新增/測試
            </h1>
          )}
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
            onClick={() => navigate('/test/quickfill', { replace: true })}
          >
            Quickfill
          </Button>
        </div>
        <PromptTemplateInput className='flex-1' />
        <PromptKeyInputs className='mb-2 flex-1' />
        <div className='flex items-center justify-center gap-2 py-2'>
          <GenerateBtn
            content='生成'
            onClick={async () => {
              let result: string;
              try {
                result = generate();
              } catch (e) {
                showToast({ type: 'error', message: '生成失敗' });
                throw e;
              }
              await PywebviewApi.copyText(result);
              showToast({ type: 'success', message: '生成成功' });
              await new Promise((resolve) => setTimeout(resolve, 500));
            }}
          />
          <SaveBtn
            onClick={() => {
              if (useStore.getState().keyValueMap.size === 0) {
                showToast({ type: 'error', message: 'keyValueMap 不能為空' });
                return;
              }
              setDialogOpen(true);
            }}
          />
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title='新增提示詞模板對話'
          description='新增提示詞模板對話'
          portal={<TemplateAppendPortal onClose={() => setDialogOpen(false)} />}
        />
      </div>
    </div>
  );
}

function TemplateAppendPortal({ onClose }: { onClose: () => void }) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const appendTemplateItem = useGlobalStore.getState().appendTemplateItem;

  return (
    <div className='min-w-96 space-y-4 rounded-md border border-(--border) bg-(--surface) p-4'>
      <div>
        <h2 className='text-xl font-bold text-(--on-surface)'>
          新增提試詞模板
        </h2>
      </div>
      <div className='flex flex-col gap-2'>
        <Label.Root
          htmlFor='append-dialogTitle'
          className='font-bold text-(--on-bg)'
        >
          標題
        </Label.Root>
        <input
          ref={titleRef}
          id='append-dialogTitle'
          tabIndex={0}
          placeholder='提示詞標題...'
          className={`${styles.surfaceScrollable} font-noto w-full resize-none rounded-md border border-(--border) bg-(--bg) p-2.5 text-sm text-(--on-bg) focus-visible:border-(--primary) focus-visible:outline-1 focus-visible:outline-(--primary)`}
          spellCheck={false}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label.Root
          htmlFor='append-dialogDescription'
          className='font-bold text-(--on-bg)'
        >
          描述
        </Label.Root>
        <textarea
          ref={descriptionRef}
          id='append-dialogDescription'
          tabIndex={0}
          placeholder='對於提示詞的描述... (可選)'
          className={`${styles.surfaceScrollable} font-noto h-20 w-full resize-none rounded-md border border-(--border) bg-(--bg) p-2.5 text-sm text-(--on-bg) focus-visible:border-(--primary) focus-visible:outline-1 focus-visible:outline-(--primary)`}
          spellCheck={false}
        />
      </div>
      <div className='flex gap-2'>
        <Button
          title='取消'
          type='button'
          variant='outline'
          className='ml-auto box-border h-8 px-2'
          onClick={onClose}
        >
          取消
        </Button>
        <FeedbackButton
          title='確認'
          type='button'
          variant='default'
          className='box-border h-8 px-2'
          onClick={async () => {
            if (!titleRef.current || !descriptionRef.current) {
              return;
            }

            const title = titleRef.current.value.trim();
            if (!title) {
              showToast({
                type: 'error',
                message: '添加失敗， "標題" 不得為空',
              });
              throw new Error('title 不得為空');
            }

            const keyValueMap = useStore.getState().keyValueMap;
            const validKeys = new Set(useStore.getState().extractKeys());
            const param: Record<string, string> = {};
            for (const [key, _] of keyValueMap) {
              if (!validKeys.has(key)) {
                const message = `key: ${key} 非法`;
                showToast({ type: 'error', message });
                throw new Error(message);
              }
              param[key] = '';
            }

            const currentTemplate = {
              title,
              description: descriptionRef.current.value,
              template: useStore.getState().template,
              param,
            };

            const result = await appendTemplateItem(currentTemplate);
            if (!result) {
              showToast({ type: 'error', message: '添加失敗' });
              throw new Error('添加失敗');
            }
            showToast({ type: 'success', message: '添加成功' });
            onClose();
          }}
        >
          確認
        </FeedbackButton>
      </div>
    </div>
  );
}

const TemplateTextareaExample = `我想了解 "\${area_name}" 這個領域的相關知識，請你幫我列舉這個領域中常見的 \${keyword_num} 個關鍵字並附上其相對應的解釋。`;
const TemplateTextareaPlaceholder =
  TemplateTextareaExample + '\n(按下 tab 鍵，試試這個 template)';

function PromptTemplateInput({ className }: { className?: string }) {
  const template = useStore((state) => state.template);
  const setTemplate = useStore.getState().setTemplate;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className={cn('h-full pt-2 pb-4', className)}>
      <div className='flex h-full flex-col gap-4'>
        <div className='flex shrink-0 grow-0 items-center gap-2'>
          <Label.Root
            htmlFor='templateInput'
            className='font-bold text-(--on-bg)'
          >
            提示詞模板輸入
          </Label.Root>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title='提示詞模板填入指南'
            description='提示詞模板填入時，需要符合以下規定'
            portal={
              <div className='rounded-md border border-(--border) bg-(--surface) p-4'>
                <h2 className='mb-2 text-xl font-bold text-(--on-surface)'>
                  提示詞模板填入指南
                </h2>
                <div className='py-2 font-semibold text-(--on-surface) [&>code]:rounded-md [&>code]:bg-(--code) [&>code]:px-1.5 [&>code]:py-1 [&>code]:text-xs [&>code]:text-(--on-code)'>
                  請輸入提示詞模板，須符合 <code>{'${key}'}</code> 的格式，{' '}
                  <code>{'key'}</code>{' '}
                  只能是英文字母、數字、底線的組合，開頭不能是數字。
                  <br />
                  <br />
                  例如： <code>{'${name}'}</code> 、 <code>{'${age}'}</code> 、{' '}
                  <code>{'${_id}'}</code> 。
                </div>
              </div>
            }
          >
            <Info className='cursor-pointer rounded-full bg-transparent p-1 text-(--on-surface) hover:text-(--tooltip)' />
          </Dialog>
        </div>
        <textarea
          id='templateInput'
          tabIndex={0}
          placeholder={TemplateTextareaPlaceholder}
          className={`${styles.surfaceScrollable} font-noto flex-1 resize-none rounded-md border border-(--border) bg-(--bg) p-2.5 text-sm text-(--on-bg) focus-visible:border-(--primary) focus-visible:outline-1 focus-visible:outline-(--primary)`}
          value={template}
          onChange={(e) => setTemplate(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && e.currentTarget.value === '') {
              e.preventDefault();
              e.currentTarget.value = TemplateTextareaExample;
              setTemplate(TemplateTextareaExample);
            }
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function PromptKeyInputs({ className }: { className?: string }) {
  const keyValueMap = useStore((state) => state.keyValueMap);
  const newKeyRef = useStore.getState().newKeyRef;
  const newPair = useStore.getState().newPair;
  const newPairsAuto = useStore.getState().newPairsAuto;
  const onSetValue = useStore.getState().setValue;
  const onDelete = useStore.getState().removePair;

  return (
    <div
      className={cn(
        styles.surfaceScrollable,
        'space-y-4 overflow-y-auto rounded-md border border-(--border) bg-(--surface) px-4 pb-2',
        className,
      )}
    >
      <div className='sticky top-0 left-0 flex w-full gap-2 bg-(--surface) pt-4 pb-2'>
        <button
          type='button'
          tabIndex={0}
          className='cursor-pointer rounded-md bg-transparent p-1 text-sm font-bold text-(--border) transition-colors duration-500 hover:bg-(--secondary) hover:text-(--on-secondary)'
          onClick={newPair}
        >
          <Tooltip content='新增' side='top' delayDuration={500}>
            <Plus />
          </Tooltip>
        </button>
        <input
          ref={newKeyRef}
          placeholder='新增 key 佔位符'
          id='newKey'
          tabIndex={0}
          className='flex-1 resize-none rounded-md border border-(--border) bg-(--bg) px-2 py-1 text-sm text-(--on-bg) focus-visible:border-(--primary) focus-visible:outline-1 focus-visible:outline-(--primary)'
          onKeyDown={(e) => e.key === 'Enter' && newPair()}
          spellCheck={false}
        />
        <button
          type='button'
          tabIndex={0}
          className='mx-auto cursor-pointer rounded-md bg-transparent p-1 text-sm font-bold text-(--border) transition-colors duration-500 hover:bg-(--secondary) hover:text-(--on-secondary)'
          onClick={newPairsAuto}
        >
          <Tooltip content='從模板自動新增' side='top' delayDuration={500}>
            <ScanText />
          </Tooltip>
        </button>
      </div>
      {Array.from(keyValueMap.entries()).map(([key, value]) => (
        <KeyInput
          key={key}
          promptKey={key}
          promptValue={value}
          onDelete={onDelete}
          onSetValue={onSetValue}
        />
      ))}
    </div>
  );
}
