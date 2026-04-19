import { Dialog as Primitive } from 'radix-ui';
import { XIcon } from 'lucide-react';

interface DialogProps {
  children?: React.ReactNode;
  portal: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  hasClose?: boolean;
}

export function Dialog({
  children,
  portal,
  title,
  description,
  open,
  onOpenChange,
  hasClose,
}: DialogProps) {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      {children && <Primitive.Trigger asChild>{children}</Primitive.Trigger>}
      <Primitive.Portal>
        <Primitive.Overlay className='fixed inset-0 bg-blue-100/20 backdrop-blur-sm' />
        <Primitive.Title>{title}</Primitive.Title>
        <Primitive.Description>{description}</Primitive.Description>
        <Primitive.Content className='fixed top-1/2 left-1/2 -translate-1/2'>
          {hasClose && (
            <Primitive.Close
              aria-label='Close'
              className='float-right m-4 rounded-md cursor-pointer text-[var(--destructive)]/50 hover:text-[var(--destructive)]'
            >
              <XIcon />
            </Primitive.Close>
          )}
          {portal}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
