import * as React from 'react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/modules/utils';

const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap cursor-pointer rounded-md p-1 text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-(--primary) text-(--on-primary) shadow-xs hover:bg-(--primary)/60',
        destructive:
          'bg-(--destructive) text-white shadow-xs hover:bg-(--destructive)/60',
        outline:
          'text-(--border) border border-(--border) bg-(--bg) shadow-xs hover:bg-(--border) hover:text-(--on-border)',
        secondary:
          'bg-(--secondary) text-(--on-secondary) shadow-xs hover:bg-(--secondary)/60',
        ghost:
          'bg-transparent text-(--border) hover:bg-(--secondary) hover:text-(--on-secondary)',
        link: 'text-(--primary) underline-offset-4 hover:underline',
        ghostDestructive:
          'bg-transparent text-(--border) hover:bg-(--destructive)/60 hover:text-(--on-secondary)',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        data-slot='button'
        tabIndex={0}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

function FeedbackButton({
  className,
  variant,
  asChild = false,
  duration = 1000,
  children,
  successIcon = <CheckIcon className='size-5' />,
  loadingIcon = <Loader2 className='size-5 animate-spin' />,
  errorIcon = <XIcon className='size-5' />,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    duration?: number;
    successIcon?: React.ReactNode;
    loadingIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
  }) {
  const Comp = asChild ? Slot : 'button';
  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (status === 'loading') return;

    try {
      setStatus('loading');
      await Promise.resolve();

      if (onClick) {
        // 若原本 onClick 是 async function，就 await 它
        await Promise.resolve(onClick(e));
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      console.error('FeedbackButton error:', err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, duration));
      setStatus('idle');
    }
  };

  let content: React.ReactNode = children;
  if (status === 'loading') {
    content = loadingIcon;
  } else if (status === 'success') {
    content = successIcon;
  } else if (status === 'error') {
    content = errorIcon;
  }

  return (
    <Comp
      data-slot='button'
      tabIndex={0}
      className={cn(buttonVariants({ variant, className }))}
      disabled={status !== 'idle' || props.disabled}
      onClick={handleClick}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Button, FeedbackButton, buttonVariants };
