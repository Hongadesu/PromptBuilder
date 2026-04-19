import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SquareArrowOutUpRight, Trash2, X } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

import {
  Button,
  Dialog,
  FeedbackButton,
  showToast,
  Tooltip,
} from '@/components/global';
import {
  useGlobalStore,
  useGroupListStore,
  useGroupDetailStore as useStore,
} from '@/stores';
import { cn } from '@/modules/utils';
import scrollbarStyles from '@/styles/Scrollbar.module.css';

type GroupDetailProps = {
  className?: string;
  children: React.ReactNode;
};

function GroupDetail({ className, children }: GroupDetailProps) {
  return (
    <div
      className={cn(
        scrollbarStyles.surfaceScrollable,
        'relative mx-4 overflow-y-auto rounded-md border border-(--border) bg-(--surface) p-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Title() {
  const title = useStore((state) => state.group);
  return (
    <h2
      className='font-noto line-clamp-1 text-xl text-(--on-surface)'
      title={title}
    >{`\${群組: ${title}}`}</h2>
  );
}

function Description() {
  const description = useStore((state) => state.description);
  return (
    <section className='[&>p]:font-noto flex w-full items-start gap-4'>
      <h2 className='font-noto shrink-0 grow-0 text-(--on-surface)'>
        {'${描述}'}
      </h2>
      {description ? (
        <p
          className={cn(
            scrollbarStyles.surfaceScrollable,
            'max-h-24 flex-1 overflow-y-auto whitespace-pre-wrap text-(--on-surface)/70',
          )}
        >
          {description}
        </p>
      ) : (
        <p className='flex-1 text-(--on-surface)/40'>{'暫無任何描述...'}</p>
      )}
    </section>
  );
}

function GridPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        scrollbarStyles.surfaceScrollable,
        'flex-1 overflow-y-auto',
      )}
    >
      <div className='px-2'>
        <ul className='grid grid-cols-3 gap-2 max-md:grid-cols-2'>
          {children}
        </ul>
      </div>
    </div>
  );
}

type GridItemProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

function GridItem({ children, asChild = false, className }: GridItemProps) {
  const Comp = asChild ? Slot : 'li';

  return (
    <Comp className={cn('cursor-pointer rounded-md p-4', className)}>
      {children}
    </Comp>
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

function ButtonSetA({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Dialog
        title='刪除群組對話'
        description='刪除群組對話'
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        portal={
          <DeleteProtal
            onClose={() => setDeleteOpen(false)}
            onDeleteEffect={() => {
              useStore.getState().reset();
              navigate('/group');
            }}
          />
        }
        hasClose
      >
        <Button
          title='刪除群組'
          type='button'
          variant='outline'
          className='box-border size-7 min-md:size-8'
        >
          <Tooltip content='刪除群組' side='top' delayDuration={0}>
            <Trash2 />
          </Tooltip>
        </Button>
      </Dialog>
    </div>
  );
}

function ButtonSetB({
  className,
  onCancel,
  onDeleteEffect,
}: {
  className?: string;
  onCancel?: () => void;
  onDeleteEffect?: () => void;
}) {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

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
      <Dialog
        title='刪除群組對話'
        description='刪除群組對話'
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        portal={
          <DeleteProtal
            onClose={() => setDeleteOpen(false)}
            onDeleteEffect={() => {
              const id = useStore.getState().groupId;
              useGroupListStore.getState().removeGroup(id);
              useStore.getState().reset();
              onDeleteEffect?.();
            }}
          />
        }
        hasClose
      >
        <Button
          title='刪除群組'
          type='button'
          variant='outline'
          className='box-border size-7 min-md:size-8'
        >
          <Tooltip content='刪除群組' side='top' delayDuration={0}>
            <Trash2 />
          </Tooltip>
        </Button>
      </Dialog>
      <Button
        title='查看'
        type='button'
        variant='outline'
        className='box-border size-7 min-md:size-8'
        onClick={() => {
          const id = useStore.getState().groupId;
          navigate(`/group/${id}`);
        }}
      >
        <Tooltip content='查看' side='top' delayDuration={0}>
          <SquareArrowOutUpRight />
        </Tooltip>
      </Button>
    </div>
  );
}

function DeleteProtal({
  onClose,
  onDeleteEffect,
}: {
  onClose: () => void;
  onDeleteEffect?: () => void;
}) {
  return (
    <div className='min-w-96 space-y-4 rounded-md border border-(--border) bg-(--surface) p-4'>
      <div>
        <h2 className='text-xl font-bold text-(--on-surface)'>刪除群組</h2>
      </div>
      <div>
        <p className='pb-2 text-(--on-surface)'>你確定要刪除嗎?</p>
        <p className='pb-2 text-(--on-surface)'>
          這會刪除這個群組，但不會影響到已存在的提示詞模板
        </p>
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
          variant='destructive'
          className='box-border h-8 px-2'
          onClick={async () => {
            const id = useStore.getState().groupId;
            const success = await useGlobalStore.getState().removeGroupItem(id);
            if (!success) {
              showToast({ type: 'error', message: '刪除失敗' });
              throw new Error('刪除失敗');
            }
            showToast({ type: 'success', message: '刪除成功' });
            onDeleteEffect?.();
            onClose();
          }}
        >
          確認
        </FeedbackButton>
      </div>
    </div>
  );
}

GroupDetail.Title = Title;
GroupDetail.Description = Description;
GroupDetail.GridPanel = GridPanel;
GroupDetail.GridItem = GridItem;
GroupDetail.ButtonSetA = ButtonSetA;
GroupDetail.ButtonSetB = ButtonSetB;

export { GroupDetail };
