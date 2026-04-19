import { Pin } from 'lucide-react';
import { FeedbackButton, Tooltip, showToast } from '@/components/global';
import { useGlobalStore } from '@/stores';
import { TemplateItem } from '@/types';

interface PinAddButtonProps {
  cache: TemplateItem;
}

export function PinAddButton({ cache }: PinAddButtonProps) {
  return (
    <FeedbackButton
      title='加入釘選'
      type='button'
      variant='outline'
      className='size-7 box-border min-md:size-8'
      onClick={async () => {
        const status = await useGlobalStore.getState().appendPinTemplateItem({
          ...cache,
        });
        switch (status) {
          case 'error':
            showToast({ type: 'error', message: '加入失敗' });
            throw new Error('加入失敗');

          case 'conflict':
            showToast({ type: 'info', message: '釘選已存在' });
            throw new Error('釘選已存在');

          default:
            showToast({ type: 'success', message: '加入成功' });
            break;
        }
      }}
    >
      <Tooltip content='加入釘選' side='left' delayDuration={0}>
        <Pin />
      </Tooltip>
    </FeedbackButton>
  );
}
