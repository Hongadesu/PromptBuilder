import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Trash2, Undo2 } from 'lucide-react';
import { Button, Tooltip } from '@/components/global';
import {
  GroupAddButton,
  PinAddButton,
  useGroupAddPortalStore,
} from '@/components/buttons';
import {
  useGlobalStore,
  useTemplateDetailStore as useStore,
  useTemplatePinStore,
  usePromptEditorStore,
} from '@/stores';
import { TemplateDetail } from '@/features/default/TemplateDetail';

export function PromptDetailPage() {
  const { promptId } = useParams();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const getDetail = useGlobalStore.getState().getTemplateDetail;
  const setEditor = usePromptEditorStore.getState().setEditor;
  const reset = useStore.getState().reset;

  useEffect(() => {
    if (promptId && promptId !== useStore.getState().id) {
      getDetail(promptId);
    }
    return () => reset();
  }, [promptId]);

  return (
    <div className='flex-1 bg-[var(--bg)] transition-all duration-500 overflow-y-auto w-full p-4 flex flex-col gap-6'>
      <div className='mt-4 mx-4 max-lg:w-11/12 max-lg:mx-auto flex gap-2'>
        <h1 className='text-[var(--on-bg-title)] text-2xl font-extrabold'>
          提示詞模板
        </h1>
        <Button
          title='上一頁'
          type='button'
          variant='outline'
          className='size-8 box-border ml-auto'
          onClick={() => navigate(-1)}
        >
          <Undo2 />
        </Button>
        <TemplateDetail.DeleteButton
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleteEffect={(id: string) => {
            useTemplatePinStore.getState().removeItem(id);
            navigate('/prompt');
          }}
        >
          <Button variant='outline' className='h-8 px-2'>
            刪除模板
          </Button>
        </TemplateDetail.DeleteButton>
        <Button
          variant='secondary'
          className='h-8 px-2'
          onClick={() => {
            const cache = useStore.getState().cache;
            if (!cache) {
              return;
            }
            setEditor(cache.template, cache.param);
            navigate('/test/default');
          }}
        >
          創建相似模板
        </Button>
      </div>
      <TemplateDetail className='flex flex-col gap-4 h-full max-lg:w-11/12 max-lg:mx-auto'>
        <header className='flex items-center gap-2'>
          <TemplateDetail.Title />
          <TemplateDetail.ButtonSetA
            className='ml-auto'
            moreButtonPortal={<MoreButtonPortal />}
          />
        </header>
        <TemplateDetail.Description />
        <TemplateDetail.Detail detailClassName='flex-1' />
      </TemplateDetail>
    </div>
  );
}

function MoreButtonPortal() {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [groupAddOpen, setGroupAddOpen] = useState(false);
  const cache = useStore((state) => state.cache);

  return (
    <div className='flex flex-col gap-2 pb-2 px-2 bg-[var(--surface)] rounded-md'>
      {cache && (
        <PinAddButton
          cache={{
            type: 'default',
            ...cache,
          }}
        />
      )}
      <GroupAddButton
        open={groupAddOpen}
        onOpenChange={setGroupAddOpen}
        onClick={() => {
          const id = useStore.getState().id;
          useGroupAddPortalStore.getState().setData(id, 'default');
        }}
      />
      <TemplateDetail.DeleteButton
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleteEffect={(id: string) => {
          useTemplatePinStore.getState().removeItem(id);
          navigate('/prompt');
        }}
      >
        <Button
          title='刪除模板'
          type='button'
          variant='outline'
          className='size-7 box-border min-md:size-8'
        >
          <Tooltip content='刪除模板' side='left' delayDuration={0}>
            <Trash2 />
          </Tooltip>
        </Button>
      </TemplateDetail.DeleteButton>
    </div>
  );
}
