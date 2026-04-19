import React, { ReactNode, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { create } from 'zustand';
import { Label } from 'radix-ui';
import {
  CheckIcon,
  ChevronDown,
  ClipboardPaste,
  CopyCheck,
  SquareArrowOutUpRight,
  Undo2,
  X,
  XIcon,
  Zap,
} from 'lucide-react';

import {
  Button,
  FeedbackButton,
  Tooltip,
  Dialog,
  Popover,
  showToast,
} from '@/components/global';
import { useGlobalStore, useQuickfillDetailStore as useStore } from '@/stores';
import { PywebviewApi } from '@/apis';
import { cn } from '@/modules/utils';
import scrollbarStyles from '@/styles/Scrollbar.module.css';

type KeyInputProps = {
  promptKey: string;
  promptValue: string;
  isFrozen: boolean;
};

const KeyInput = React.memo(
  ({ promptKey, promptValue, isFrozen }: KeyInputProps) => {
    const onSetValue = useStore.getState().setValue;

    return (
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <Label.Root
            htmlFor={`input-${promptKey}`}
            className='content-center rounded-md bg-[var(--secondary)] px-2 py-1 text-xs font-bold text-[var(--on-secondary)]'
          >
            {promptKey}
          </Label.Root>
          <button
            type='button'
            tabIndex={0}
            className={cn(
              'ml-auto flex items-center justify-center rounded-md p-1.5',
              !isFrozen
                ? 'cursor-pointer border border-[var(--border)] bg-transparent text-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--on-border)]'
                : 'cursor-not-allowed border border-[var(--on-muted)] bg-[var(--muted)] text-[var(--on-muted)]',
            )}
            onClick={() => {
              PywebviewApi.pasteText().then((content) =>
                onSetValue(promptKey, content),
              );
            }}
            disabled={isFrozen}
          >
            <ClipboardPaste className='size-4' />
          </button>
        </div>
        <textarea
          id={`input-${promptKey}`}
          tabIndex={0}
          className={cn(
            scrollbarStyles.surfaceScrollable,
            `h-20 min-w-24 resize-none rounded-md bg-[var(--bg)] px-2 py-1 text-sm text-[var(--on-bg)]`,
            !isFrozen
              ? 'border border-[var(--border)] focus-visible:border-[var(--primary)] focus-visible:outline-1 focus-visible:outline-[var(--primary)]'
              : 'border border-[var(--on-muted)]',
          )}
          onChange={(e) => onSetValue(promptKey, e.target.value)}
          spellCheck={false}
          value={promptValue}
          disabled={isFrozen}
        />
      </div>
    );
  },
);

function QuickDetail({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        scrollbarStyles.surfaceScrollable,
        'relative mx-4 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface)] p-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Title() {
  const title = useStore((state) => state.title);
  return (
    <h2
      className='font-noto line-clamp-1 text-xl text-[var(--on-surface)]'
      title={title}
    >{`\${標題: ${title}}`}</h2>
  );
}

function Description() {
  const description = useStore((state) => state.description);
  return (
    <section className='[&>p]:font-noto flex w-full items-start gap-4'>
      <h2 className='font-noto shrink-0 grow-0 text-[var(--on-surface)]'>
        {'${描述}'}
      </h2>
      {description ? (
        <p
          className={cn(
            scrollbarStyles.surfaceScrollable,
            'max-h-32 flex-1 overflow-y-auto whitespace-pre-wrap text-[var(--on-surface)]/70',
          )}
        >
          {description}
        </p>
      ) : (
        <p className='flex-1 text-[var(--on-surface)]/40'>
          {'暫無任何描述...'}
        </p>
      )}
    </section>
  );
}

function Detail({ className }: { className?: string }) {
  const template = useStore((state) => state.template);
  const keyValueMap = useStore((state) => state.keyValueMap);
  return (
    <div
      className={cn(
        className,
        'flex w-full gap-4 overflow-hidden pr-4 pb-0 max-md:flex-col max-md:pr-0 max-md:pb-4',
      )}
    >
      {/* 模板 */}
      <div className='flex flex-1/2 shrink-0 grow-0 flex-col gap-2 overflow-hidden'>
        <Label.Root
          htmlFor='templateDetailInput'
          className='font-bold text-[var(--on-bg)]'
        >
          {'${提示詞模板}'}
        </Label.Root>
        <textarea
          id='templateDetailInput'
          tabIndex={0}
          value={template}
          className={`${scrollbarStyles.surfaceScrollable} font-noto flex-1 resize-none rounded-md border border-[var(--muted)] bg-[var(--bg)] p-2.5 text-sm text-[var(--on-bg)] focus-visible:border-[var(--primary)] focus-visible:outline-1 focus-visible:outline-[var(--primary)]`}
          disabled={true}
          spellCheck={false}
        />
      </div>
      {/* Key-Value 配對 */}
      <div className='flex flex-1/2 shrink-0 grow-0 flex-col gap-2 overflow-hidden'>
        <h3 className='font-bold text-[var(--on-bg)]'>{'${變量填充}'}</h3>
        <div
          className={`${scrollbarStyles.surfaceScrollable} flex-1 space-y-4 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface)] p-4`}
        >
          {keyValueMap.map((item) => (
            <KeyInput
              key={item.key}
              promptKey={item.key}
              promptValue={item.value}
              isFrozen={item.frozen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * DetailTabButtons Group
 */
type DetailTabName = 'template' | 'variables';
const SelectedButton = 'bg-[var(--primary)] text-[var(--on-primary)]';
const UnselectedButton =
  'bg-[var(--surface)] text-[var(--on-surface)] cursor-pointer hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]';

interface DetailTabState {
  tabName: DetailTabName;
  floatTabName: DetailTabName | 'unset';
}

interface DetailTabActions {
  setTabName: (name: DetailTabName) => void;
  setFloatTabName: (name: DetailTabName | 'unset') => void;
  reset: () => void;
}

const initDetailTabState: DetailTabState = {
  tabName: 'variables',
  floatTabName: 'unset',
};

const useDetailTabStore = create<DetailTabState & DetailTabActions>((set) => ({
  ...initDetailTabState,
  setTabName: (name) => set({ tabName: name }),
  setFloatTabName: (name) => set({ floatTabName: name }),
  reset: () => set(initDetailTabState),
}));

function DetailTabButtons() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tabName = useDetailTabStore((state) => state.tabName);
  const setFloatTabName = useDetailTabStore.getState().setFloatTabName;
  const setTabName = useDetailTabStore.getState().setTabName;

  return (
    <div className='flex w-fit gap-2'>
      <button
        title=''
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 rounded-md px-2 max-md:px-1 max-md:text-xs',
          tabName === 'template' ? SelectedButton : UnselectedButton,
        )}
        onClick={() => {
          if (tabName === 'template') {
            return;
          }
          setTabName('template');
        }}
        onMouseEnter={() => {
          if (tabName === 'template') {
            return;
          }
          timerRef.current = setTimeout(() => {
            setFloatTabName('template');
          }, 500);
        }}
        onMouseLeave={() => {
          if (tabName === 'template') {
            return;
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            setFloatTabName('unset');
          }
        }}
      >
        {'${提示詞模板}'}
      </button>
      <button
        title=''
        type='button'
        tabIndex={0}
        className={cn(
          'h-8 rounded-md px-2 max-md:px-1 max-md:text-xs',
          tabName === 'variables' ? SelectedButton : UnselectedButton,
        )}
        onClick={() => {
          if (tabName === 'variables') {
            return;
          }
          setTabName('variables');
        }}
        onMouseEnter={() => {
          if (tabName === 'variables') {
            return;
          }
          timerRef.current = setTimeout(() => {
            setFloatTabName('variables');
          }, 500);
        }}
        onMouseLeave={() => {
          if (tabName === 'variables') {
            return;
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            setFloatTabName('unset');
          }
        }}
      >
        {'${變量填充}'}
      </button>
    </div>
  );
}

const DetailTabKeyInput = React.memo(
  ({ promptKey, promptValue, isFrozen }: KeyInputProps) => {
    const onSetValue = useStore.getState().setValue;

    return (
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <Label.Root
            htmlFor={`input-${promptKey}`}
            className='content-center rounded-md bg-[var(--secondary)] px-2 py-1 text-xs font-bold text-[var(--on-secondary)]'
          >
            {promptKey}
          </Label.Root>
          <button
            type='button'
            tabIndex={0}
            className={cn(
              'ml-auto flex items-center justify-center rounded-md p-1.5',
              !isFrozen
                ? 'cursor-pointer border border-[var(--border)] bg-transparent text-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--on-border)]'
                : 'cursor-not-allowed border border-[var(--on-muted)] bg-[var(--muted)] text-[var(--on-muted)]',
            )}
            onClick={() => {
              PywebviewApi.pasteText().then((content) =>
                onSetValue(promptKey, content),
              );
            }}
            disabled={isFrozen}
          >
            <ClipboardPaste className='size-4' />
          </button>
        </div>
        <textarea
          id={`input-${promptKey}`}
          tabIndex={0}
          className={cn(
            scrollbarStyles.surfaceScrollable,
            `h-20 min-w-24 resize-none rounded-md bg-[var(--bg)] px-2 py-1 text-sm text-[var(--on-bg)]`,
            !isFrozen
              ? 'border border-[var(--border)] focus-visible:border-[var(--primary)] focus-visible:outline-1 focus-visible:outline-[var(--primary)]'
              : 'border border-[var(--on-muted)]',
          )}
          onChange={(e) => onSetValue(promptKey, e.target.value)}
          spellCheck={false}
          value={promptValue}
          disabled={isFrozen}
        />
      </div>
    );
  },
);

interface DetailTabStyleProps {
  detailClassName?: string;
}

function DetailTabStyle({ detailClassName }: DetailTabStyleProps) {
  const template = useStore((state) => state.template);
  const keyValueMap = useStore((state) => state.keyValueMap);

  const tabName = useDetailTabStore((state) => state.tabName);
  const floatTabName = useDetailTabStore((state) => state.floatTabName);

  return (
    <div
      className={cn(
        detailClassName,
        'flex h-full w-full flex-col gap-4 overflow-hidden',
      )}
    >
      <div className='relative h-full w-full'>
        {/* 模板 */}
        {(tabName === 'template' || floatTabName === 'template') && (
          <div
            style={
              floatTabName === 'template'
                ? {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: 1,
                  }
                : {
                    position: 'relative',
                  }
            }
            className='flex h-full w-full flex-col overflow-hidden'
          >
            <textarea
              id='templateDetailInput'
              tabIndex={0}
              value={template}
              className={`${scrollbarStyles.surfaceScrollable} font-noto flex-1 resize-none rounded-md border border-[var(--muted)] bg-[var(--bg)] p-2.5 text-sm text-[var(--on-bg)] focus-visible:border-[var(--primary)] focus-visible:outline-1 focus-visible:outline-[var(--primary)]`}
              disabled={true}
              spellCheck={false}
            />
          </div>
        )}
        {/* Key-Value 配對 */}
        {(tabName === 'variables' || floatTabName === 'variables') && (
          <div
            style={
              floatTabName === 'variables'
                ? {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: 1,
                  }
                : {
                    position: 'relative',
                  }
            }
            className='flex h-full w-full flex-col overflow-hidden'
          >
            <div
              className={`${scrollbarStyles.surfaceScrollable} flex-1 space-y-4 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface)] p-4`}
            >
              {keyValueMap.map((item) => (
                <DetailTabKeyInput
                  key={item.key}
                  promptKey={item.key}
                  promptValue={item.value}
                  isFrozen={item.frozen}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ButtonSetA({
  className,
  moreButtonPortal,
}: {
  className?: string;
  moreButtonPortal: ReactNode;
}) {
  const [popOpen, setPopOpen] = useState(false);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover
        portal={moreButtonPortal}
        sideOffset={8}
        open={popOpen}
        onOpenChange={setPopOpen}
      >
        <Button
          title='更多'
          type='button'
          variant='outline'
          className='box-border size-7 min-md:size-8'
        >
          <Tooltip content='更多' side='top' delayDuration={0}>
            <ChevronDown
              className={cn(
                'transition-transform duration-500',
                popOpen && 'rotate-180',
              )}
            />
          </Tooltip>
        </Button>
      </Popover>
      <FeedbackButton
        title='複製提示詞'
        type='button'
        variant='secondary'
        className='box-border size-7 min-md:size-8'
        onClick={async () => {
          let result: string;
          try {
            result = useStore.getState().generate();
            await PywebviewApi.copyText(result);
            showToast({ type: 'success', message: '複製成功' });
          } catch (e) {
            showToast({ type: 'error', message: '轉換失敗' });
            throw e;
          }
        }}
      >
        <Tooltip content='複製提示詞' side='top' delayDuration={0}>
          <CopyCheck />
        </Tooltip>
      </FeedbackButton>
      <FeedbackButton
        title='快速轉換'
        type='button'
        variant='secondary'
        className='box-border size-7 min-md:size-8'
        onClick={async () => {
          let result: string;
          try {
            const currContent = await PywebviewApi.pasteText();
            result = useStore.getState().quickGenerate(currContent);
            await PywebviewApi.copyText(result);
            showToast({ type: 'success', message: '複製成功' });
          } catch (e) {
            showToast({ type: 'error', message: '轉換失敗' });
            throw e;
          }
        }}
      >
        <Tooltip content='快速轉換' side='top' delayDuration={0}>
          <Zap />
        </Tooltip>
      </FeedbackButton>
    </div>
  );
}

function ButtonSetB({
  moreButtonPortal,
  className,
  onCancel,
}: {
  moreButtonPortal: ReactNode;
  onCancel?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const [popOpen, setPopOpen] = useState(false);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        title='取消'
        type='button'
        variant='outline'
        className='box-border size-7 min-md:size-8'
        onClick={() => {
          useStore.getState().reset();
          onCancel?.();
        }}
      >
        <Tooltip content='取消' side='top' delayDuration={0}>
          <X />
        </Tooltip>
      </Button>
      <Button
        title='查看'
        type='button'
        variant='outline'
        className='box-border size-7 min-md:size-8'
        onClick={() => {
          const id = useStore.getState().id;
          navigate(`/quickfill/${id}`);
        }}
      >
        <Tooltip content='查看' side='top' delayDuration={0}>
          <SquareArrowOutUpRight />
        </Tooltip>
      </Button>
      <Popover
        portal={moreButtonPortal}
        sideOffset={8}
        open={popOpen}
        onOpenChange={setPopOpen}
      >
        <Button
          title='更多'
          type='button'
          variant='outline'
          className='box-border size-7 min-md:size-8'
        >
          <Tooltip content='更多' side='top' delayDuration={0}>
            <ChevronDown
              className={cn(
                'transition-transform duration-500',
                popOpen && 'rotate-180',
              )}
            />
          </Tooltip>
        </Button>
      </Popover>
      <FeedbackButton
        title='複製提示詞'
        type='button'
        variant='secondary'
        className='box-border size-7 min-md:size-8'
        successIcon={<CheckIcon className='text-[var(--on-secondary)]' />}
        errorIcon={<XIcon className='text-[var(--on-secondary)]' />}
        onClick={async () => {
          let result: string;
          try {
            result = useStore.getState().generate();
            await PywebviewApi.copyText(result);
            showToast({ type: 'success', message: '複製成功' });
          } catch (e) {
            showToast({ type: 'error', message: '轉換失敗' });
            throw e;
          }
        }}
      >
        <Tooltip content='複製提示詞' side='top' delayDuration={0}>
          <CopyCheck />
        </Tooltip>
      </FeedbackButton>
      <FeedbackButton
        title='快速轉換'
        type='button'
        variant='secondary'
        className='box-border size-7 min-md:size-8'
        onClick={async () => {
          let result: string;
          try {
            const currContent = await PywebviewApi.pasteText();
            result = useStore.getState().quickGenerate(currContent);
            await PywebviewApi.copyText(result);
            showToast({ type: 'success', message: '複製成功' });
          } catch (e) {
            showToast({ type: 'error', message: '轉換失敗' });
            throw e;
          }
        }}
      >
        <Tooltip content='快速轉換' side='top' delayDuration={0}>
          <Zap />
        </Tooltip>
      </FeedbackButton>
    </div>
  );
}

function DeleteButton({
  children,
  open,
  onOpenChange,
  onDeleteEffect,
}: {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteEffect?: (id: string) => void;
}) {
  return (
    <Dialog
      title='刪除模板對話'
      description='刪除模板對話'
      open={open}
      onOpenChange={onOpenChange}
      portal={
        <DeletePortal
          onDeleteEffect={onDeleteEffect}
          onClose={() => onOpenChange(false)}
        />
      }
      hasClose
    >
      {children}
    </Dialog>
  );
}

function DeletePortal({
  onClose,
  onDeleteEffect,
}: {
  onClose: () => void;
  onDeleteEffect?: (id: string) => void;
}) {
  return (
    <div className='min-w-96 space-y-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4'>
      <div>
        <h2 className='text-xl font-bold text-[var(--on-surface)]'>
          刪除提試詞模板
        </h2>
      </div>
      <p className='text-[var(--on-surface)]'>你確定要刪除嗎?</p>
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
          variant='destructive'
          className='box-border h-8 px-2'
          onClick={async () => {
            const id = useStore.getState().id;
            const success = await useGlobalStore
              .getState()
              .removeQuickfillItem(id);
            if (!success) {
              showToast({ type: 'error', message: '刪除失敗' });
              throw new Error('刪除失敗');
            }
            showToast({ type: 'success', message: '刪除成功' });
            onDeleteEffect?.(id);
            useStore.getState().reset();
            onClose();
          }}
        >
          確認
        </FeedbackButton>
      </div>
    </div>
  );
}

{
  /* <Button
  title='編輯'
  type='button'
  variant='outline'
  className='size-7 box-border min-md:size-8'
>
  <Tooltip content='編輯' side='top' delayDuration={0}>
    <FilePen />
  </Tooltip>
</Button> */
}

QuickDetail.Title = Title;
QuickDetail.Description = Description;
QuickDetail.Detail = Detail;
QuickDetail.DetailTabStyle = DetailTabStyle;
QuickDetail.DetailTabButtons = DetailTabButtons;
QuickDetail.ButtonSetA = ButtonSetA;
QuickDetail.ButtonSetB = ButtonSetB;
QuickDetail.DeleteButton = DeleteButton;

export { QuickDetail, useDetailTabStore };
