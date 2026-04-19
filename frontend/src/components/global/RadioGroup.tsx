'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/modules/utils';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot='radio-group'
      className={cn('grid w-full gap-2', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot='radio-group-item'
      className={cn(
        'group/radio-group-item peer border-input relative flex aspect-square size-4 shrink-0 rounded-full border outline-none after:absolute after:-inset-x-3 after:-inset-y-2',
        'focus-visible:border-(--border) focus-visible:ring-3 focus-visible:ring-(--border)/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 aria-invalid:aria-checked:border-(--secondary)',
        'data-[state=checked]:border-(--secondary) data-[state=checked]:bg-(--secondary) data-[state=checked]:text-(--on-secondary) dark:data-[state=checked]:bg-(--secondary)',
        'dark:bg-(--border)/30 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot='radio-group-indicator'
        className='flex size-4 items-center justify-center'
      >
        <span className='absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--on-secondary)' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
