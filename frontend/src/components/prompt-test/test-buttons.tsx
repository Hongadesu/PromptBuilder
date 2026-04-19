import { Check, Loader2, XIcon } from 'lucide-react';
import { Button, FeedbackButton } from '@/components/global';

interface GenerateBtnProps {
  content: string;
}

export function GenerateBtn({
  content,
  onClick,
}: GenerateBtnProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <FeedbackButton
      successIcon={
        <>
          {content}
          <Check className='text-[var(--success)]' />
        </>
      }
      loadingIcon={
        <>
          {content}
          <Loader2 className='animate-spin' />
        </>
      }
      errorIcon={
        <>
          {content}
          <XIcon className='text-[var(--destructive)]' />
        </>
      }
      onClick={onClick}
      className='flex gap-1 h-8 px-2 py-1 border border-[var(--on-bg)] hover:border-transparent bg-transparent hover:bg-[var(--secondary)] text-[var(--on-bg)] hover:text-[var(--on-secondary)]'
    >
      {content}
    </FeedbackButton>
  );
}

interface SaveBtnProps {
  onClick: () => void;
}

export function SaveBtn({ onClick }: SaveBtnProps) {
  return (
    <Button
      className='h-8 select-none box-border font-bold transition-all duration-500 px-2 bg-[var(--primary)] text-[var(--on-primary)]'
      onClick={onClick}
    >
      新增
    </Button>
  );
}
