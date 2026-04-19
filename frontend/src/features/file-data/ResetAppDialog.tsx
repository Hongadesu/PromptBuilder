import { ReactNode } from 'react';

import { PywebviewApi } from '@/apis';
import { useGlobalStore } from '@/stores';
import { Button, Dialog, FeedbackButton, showToast } from '@/components/global';

type ResetAppDialogProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ResetAppDialog({
  children,
  open,
  onOpenChange,
}: ResetAppDialogProps) {
  return (
    <Dialog
      title='刪除並重置'
      description='刪除並重置對話'
      open={open}
      onOpenChange={onOpenChange}
      portal={<Portal onClose={() => onOpenChange(false)} />}
      hasClose
    >
      {children}
    </Dialog>
  );
}

type PortalProps = {
  onClose: () => void;
};

function Portal({ onClose }: PortalProps) {
  return (
    <div className='min-w-96 space-y-4 rounded-md border border-(--border) bg-(--surface) p-4'>
      <div>
        <h2 className='text-xl font-bold text-(--on-surface)'>刪除並重置</h2>
      </div>
      <p className='text-(--on-surface)'>
        你確定要刪除並重置 PromptBuilder 嗎?
      </p>
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
            try {
              await PywebviewApi.clearAppData();
              useGlobalStore.getState().resetAllStores();
            } catch (error) {
              showToast({ type: 'error', message: '重置失敗' });
              throw error;
            }

            showToast({ type: 'success', message: '重置成功' });
            onClose();
          }}
        >
          確認
        </FeedbackButton>
      </div>
    </div>
  );
}
