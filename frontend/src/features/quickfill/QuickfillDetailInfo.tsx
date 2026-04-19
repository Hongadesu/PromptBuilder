import { MoreButtonPortal } from './MoreButtonPortal';
import { QuickDetail } from './QuickfillDetail';

interface QuickfillDetailInfoProps {
  onClose?: () => void;
  hasDelete?: boolean;
  hasPin?: boolean;
  hasGroupAdd?: boolean;
}

export function QuickfillDetailInfo({
  onClose,
  hasDelete,
  hasPin,
  hasGroupAdd,
}: QuickfillDetailInfoProps) {
  return (
    <QuickDetail className='mx-0 flex h-full flex-col gap-4 border-0 px-4 pt-6 pb-2'>
      <QuickDetail.ButtonSetB
        className='absolute top-3 right-4 ml-auto'
        moreButtonPortal={
          <MoreButtonPortal
            options={{ hasDelete, hasPin, hasGroupAdd }}
            onDeleteEffect={onClose}
          />
        }
        onCancel={onClose}
      />
      <QuickDetail.Detail className='flex-1' />
    </QuickDetail>
  );
}
