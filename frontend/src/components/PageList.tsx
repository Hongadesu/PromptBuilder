import { Slot } from '@radix-ui/react-slot';
import { Button } from '@/components/global';
import { cn } from '@/modules/utils';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import styles from '@/styles/Scrollbar.module.css';

function PageList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('flex flex-col gap-4 h-full p-2', className)}>
      {children}
    </section>
  );
}

type HeaderProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

function Header({ children, asChild = false, className }: HeaderProps) {
  const Comp = asChild ? Slot : 'h2';

  return (
    <Comp
      className={cn('font-bold text-xl text-[var(--on-surface)]', className)}
    >
      {children}
    </Comp>
  );
}

function GridPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(styles.surfaceScrollable, 'flex-1 overflow-y-auto')}>
      <div className='px-2'>
        <ul className='grid grid-cols-3 gap-2 max-md:grid-cols-2'>
          {children}
        </ul>
      </div>
    </div>
  );
}

type GridItemProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

function GridItem({ children, asChild = false, className }: GridItemProps) {
  const Comp = asChild ? Slot : 'li';

  return (
    <Comp className={cn('rounded-md p-4 cursor-pointer', className)}>
      {children}
    </Comp>
  );
}

function ListPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(styles.surfaceScrollable, 'flex-1 overflow-y-auto')}>
      <div className='px-2'>
        <ul className='flex flex-col gap-2'>{children}</ul>
      </div>
    </div>
  );
}

type ListItemProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

// border border-[var(--border)]
function ListItem({ children, asChild = false, className }: ListItemProps) {
  const Comp = asChild ? Slot : 'li';

  return (
    <Comp
      className={cn(
        'rounded-md p-2 bg-[var(--surface)] cursor-pointer',
        className,
      )}
    >
      {children}
    </Comp>
  );
}

function SwitchPanel({
  currPage,
  maxPage,
  switchPage,
}: {
  currPage: number;
  maxPage: number;
  switchPage: (page: number) => void;
}) {
  return (
    <div className='flex justify-center items-center gap-2'>
      <Button
        tabIndex={0}
        disabled={currPage - 1 < 1}
        variant='outline'
        className='size-7 rounded-md p-1'
        onClick={() => switchPage(currPage - 1)}
      >
        <ChevronLeft />
      </Button>
      {currPage - 1 > 2 && (
        <Button
          variant='ghost'
          className='size-7 rounded-md p-1'
          onClick={() => switchPage(1)}
        >
          <Ellipsis />
        </Button>
      )}
      {currPage - 2 >= 1 && (
        <Button
          variant='outline'
          className='size-7 rounded-md p-1'
          onClick={() => switchPage(currPage - 2)}
        >
          {currPage - 2}
        </Button>
      )}
      {currPage - 1 >= 1 && (
        <Button
          variant='outline'
          className='size-7 rounded-md p-1'
          onClick={() => switchPage(currPage - 1)}
        >
          {currPage - 1}
        </Button>
      )}
      <Button variant='default' className='size-7 rounded-md p-1'>
        {currPage}
      </Button>
      {currPage + 1 <= maxPage && (
        <Button
          variant='outline'
          className='size-7 rounded-md p-1'
          onClick={() => switchPage(currPage + 1)}
        >
          {currPage + 1}
        </Button>
      )}
      {currPage + 2 <= maxPage && (
        <Button
          variant='outline'
          className='size-7 rounded-md p-1'
          onClick={() => switchPage(currPage + 2)}
        >
          {currPage + 2}
        </Button>
      )}
      {maxPage - currPage > 2 && (
        <Button
          variant='ghost'
          className='size-7 rounded-md p-1'
          onClick={() => switchPage(maxPage)}
        >
          <Ellipsis />
        </Button>
      )}
      <Button
        disabled={currPage + 1 > maxPage}
        variant='outline'
        className='size-7 rounded-md p-1'
        onClick={() => switchPage(currPage + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

function SwitchPanelSmall({
  currPage,
  maxPage,
  switchPage,
}: {
  currPage: number;
  maxPage: number;
  switchPage: (page: number) => void;
}) {
  return (
    <div className='flex justify-center items-center gap-2'>
      <Button
        tabIndex={0}
        disabled={currPage - 1 < 1}
        variant='outline'
        className='size-7 rounded-md p-1'
        onClick={() => switchPage(currPage - 1)}
      >
        <ChevronLeft />
      </Button>
      {currPage - 1 > 2 && (
        <Button
          variant='ghost'
          className='size-7 rounded-md p-1 max-lg:hidden'
          onClick={() => switchPage(1)}
        >
          <Ellipsis />
        </Button>
      )}
      {currPage - 1 >= 1 && (
        <Button
          variant='outline'
          className='size-7 rounded-md p-1 max-md:hidden'
          onClick={() => switchPage(currPage - 1)}
        >
          {currPage - 1}
        </Button>
      )}
      <Button variant='default' className='size-7 rounded-md p-1'>
        {currPage}
      </Button>
      {currPage + 1 <= maxPage && (
        <Button
          variant='outline'
          className='size-7 rounded-md p-1 max-md:hidden'
          onClick={() => switchPage(currPage + 1)}
        >
          {currPage + 1}
        </Button>
      )}
      {maxPage - currPage > 2 && (
        <Button
          variant='ghost'
          className='size-7 rounded-md p-1 max-lg:hidden'
          onClick={() => switchPage(maxPage)}
        >
          <Ellipsis />
        </Button>
      )}
      <Button
        disabled={currPage + 1 > maxPage}
        variant='outline'
        className='size-7 rounded-md p-1'
        onClick={() => switchPage(currPage + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

PageList.Header = Header;
PageList.GridPanel = GridPanel;
PageList.GridItem = GridItem;
PageList.ListPanel = ListPanel;
PageList.ListItem = ListItem;
PageList.SwitchPanel = SwitchPanel;
PageList.SwitchPanelSmall = SwitchPanelSmall;

export { PageList };
