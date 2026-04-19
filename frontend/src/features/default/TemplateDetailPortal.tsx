import { useEffect } from 'react';

import { MoreButtonPortal } from './MoreButtonPortal';
import { TemplateDetail, useDetailTabStore } from './TemplateDetail';

interface TemplateDetailInfoProps {
  onClose?: () => void;
  hasDelete?: boolean;
  hasPin?: boolean;
  hasGroupAdd?: boolean;
}

export function TemplateDetailInfoPortal({
  onClose,
  hasDelete,
  hasPin,
  hasGroupAdd,
}: TemplateDetailInfoProps) {
  const reset = useDetailTabStore.getState().reset;

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <TemplateDetail className='flex h-96 w-xl flex-col gap-4 p-4 max-md:w-sm'>
      <header className='flex items-center gap-2'>
        <TemplateDetail.DetailTabButtons />
        <TemplateDetail.ButtonSetB
          className='ml-auto'
          moreButtonPortal={
            <MoreButtonPortal
              options={{ hasDelete, hasPin, hasGroupAdd }}
              onDeleteEffect={onClose}
            />
          }
          onCancel={onClose}
        />
      </header>
      <TemplateDetail.DetailTabStyle />
    </TemplateDetail>
  );
}
