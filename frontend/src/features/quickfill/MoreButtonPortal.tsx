import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { Button, Tooltip } from '@/components/global';
import {
  GroupAddButton,
  PinAddButton,
  useGroupAddPortalStore,
} from '@/components/buttons';
import {
  useTemplatePinStore,
  useQuickfillDetailStore,
  useQuickfillListStore,
} from '@/stores';
import { QuickDetail } from './QuickfillDetail';

type ButtonOptions = {
  hasDelete?: boolean;
  hasPin?: boolean;
  hasGroupAdd?: boolean;
};

type MoreButtonPortalProps = {
  options: ButtonOptions;
  onDeleteEffect?: () => void;
};

export function MoreButtonPortal({
  options,
  onDeleteEffect,
}: MoreButtonPortalProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [groupAddOpen, setGroupAddOpen] = useState(false);
  const cache = useQuickfillDetailStore((state) => state.cache);

  const hasDelete = options.hasDelete ?? true;
  const hasPin = options.hasPin ?? true;
  const hasGroupAdd = options.hasGroupAdd ?? true;

  return (
    <div className='flex flex-col gap-2 rounded-md bg-(--surface) px-2 pb-2'>
      {hasPin && cache && (
        <PinAddButton
          cache={{
            type: 'quickfill',
            ...cache,
          }}
        />
      )}
      {hasGroupAdd && (
        <GroupAddButton
          open={groupAddOpen}
          onOpenChange={setGroupAddOpen}
          onClick={() => {
            const id = useQuickfillDetailStore.getState().id;
            useGroupAddPortalStore.getState().setData(id, 'quickfill');
          }}
        />
      )}
      {hasDelete && (
        <QuickDetail.DeleteButton
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleteEffect={(id: string) => {
            useQuickfillListStore.getState().removeItem(id);
            useTemplatePinStore.getState().removeItem(id);
            onDeleteEffect?.();
          }}
        >
          <Button
            title='刪除模板'
            type='button'
            variant='outline'
            className='box-border size-7 min-md:size-8'
          >
            <Tooltip content='刪除模板' side='left' delayDuration={0}>
              <Trash2 />
            </Tooltip>
          </Button>
        </QuickDetail.DeleteButton>
      )}
    </div>
  );
}
