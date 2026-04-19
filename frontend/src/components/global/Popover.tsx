import { Popover as Primative } from 'radix-ui';
import styles from './Popover.module.css';

type PopoverProps = {
  children: React.ReactNode;
  portal: React.ReactNode;
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Popover({
  children,
  portal,
  sideOffset,
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <Primative.Root onOpenChange={onOpenChange} open={open}>
      <Primative.Trigger asChild>{children}</Primative.Trigger>
      <Primative.Portal>
        <Primative.Content
          className={styles.PopoverContent}
          sideOffset={sideOffset}
        >
          {portal}
        </Primative.Content>
      </Primative.Portal>
    </Primative.Root>
  );
}
