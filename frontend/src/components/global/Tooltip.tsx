import { ReactNode } from 'react';
import { Tooltip as Primitive } from 'radix-ui';

export function Tooltip({
  content,
  delayDuration,
  side,
  children,
}: {
  content: ReactNode | string;
  children: ReactNode;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <Primitive.Provider delayDuration={delayDuration}>
      <Primitive.Root>
        <Primitive.Trigger asChild>{children}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content
            className='z-9999 select-none rounded-md px-3 py-1.5 leading-normal bg-[var(--tooltip)] text-[var(--on-tooltip)] text-sm font-semibold'
            side={side}
            sideOffset={5}
          >
            {content}
            <Primitive.Arrow className='fill-[var(--tooltip)]' />
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </Primitive.Provider>
  );
}
