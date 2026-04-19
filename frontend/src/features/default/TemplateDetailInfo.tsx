import { MoreButtonPortal } from './MoreButtonPortal';
import { TemplateDetail } from './TemplateDetail';

interface TemplateDetailInfoProps {
  onClose?: () => void;
  hasDelete?: boolean;
  hasPin?: boolean;
  hasGroupAdd?: boolean;
}

export function TemplateDetailInfo({
  onClose,
  hasDelete,
  hasPin,
  hasGroupAdd,
}: TemplateDetailInfoProps) {
  return (
    <TemplateDetail className='mx-0 flex h-full flex-col gap-4 border-0 px-4 pt-6 pb-2'>
      <TemplateDetail.ButtonSetB
        className='absolute top-3 right-4 ml-auto'
        moreButtonPortal={
          <MoreButtonPortal
            options={{ hasDelete, hasPin, hasGroupAdd }}
            onDeleteEffect={onClose}
          />
        }
        onCancel={onClose}
      />
      <TemplateDetail.Detail detailClassName='flex-1' />
    </TemplateDetail>
  );
}
