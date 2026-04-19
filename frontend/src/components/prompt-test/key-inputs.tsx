import React from 'react';
import { Label } from 'radix-ui';
import { ClipboardPaste, Trash2, Snowflake } from 'lucide-react';

import { PywebviewApi } from '@/apis';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

interface KeyInputProps {
  promptKey: string;
  promptValue: string;
  onDelete: (key: string) => void;
  onSetValue: (key: string, newValue: string) => void;
}

export const KeyInput = React.memo(
  ({ promptKey, promptValue, onDelete, onSetValue }: KeyInputProps) => {
    return (
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <Label.Root
            htmlFor={`input-${promptKey}`}
            className='text-xs content-center font-bold px-2 py-1 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-md'
          >
            {promptKey}
          </Label.Root>
          <button
            type='button'
            tabIndex={0}
            className='ml-auto flex justify-center items-center p-1.5 rounded-md cursor-pointer bg-transparent border border-[var(--border)] text-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--on-border)]'
            onClick={() => {
              PywebviewApi.pasteText().then((content) => {
                onSetValue(promptKey, content);
              });
            }}
          >
            <ClipboardPaste className='size-4' />
          </button>
          <button
            type='button'
            tabIndex={0}
            className='flex justify-center items-center p-1.5 rounded-md cursor-pointer bg-transparent border border-[var(--border)] text-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--on-border)]'
            onClick={() => onDelete(promptKey)}
          >
            <Trash2 className='size-4' />
          </button>
        </div>
        <textarea
          id={`input-${promptKey}`}
          tabIndex={0}
          className={`${styles.surfaceScrollable} bg-[var(--bg)] min-w-24 h-20 text-sm text-[var(--on-bg)] resize-none px-2 py-1 border border-[var(--border)] rounded-md focus-visible:outline-1 focus-visible:outline-[var(--primary)] focus-visible:border-[var(--primary)]`}
          value={promptValue}
          onChange={(e) => onSetValue(promptKey, e.target.value)}
          spellCheck={false}
        />
      </div>
    );
  },
);

interface LockableKeyInputProps {
  promptKey: string;
  promptValue: string;
  isFrozen: boolean;
  onDelete: (key: string) => void;
  onSetValue: (key: string, newValue: string) => void;
  onSetFrozen: (key: string) => void;
}

export const LockableKeyInput = React.memo(
  ({
    promptKey,
    promptValue,
    isFrozen,
    onDelete,
    onSetValue,
    onSetFrozen,
  }: LockableKeyInputProps) => {
    return (
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <Label.Root
            htmlFor={`input-${promptKey}`}
            className='text-xs content-center font-bold px-2 py-1 bg-[var(--secondary)] text-[var(--on-secondary)] rounded-md'
          >
            {promptKey}
          </Label.Root>
          <button
            type='button'
            tabIndex={0}
            className={cn(
              'ml-auto flex justify-center items-center p-1.5 rounded-md border bg-transparent',
              isFrozen
                ? 'cursor-not-allowed border-[var(--on-muted)] text-[var(--on-muted)]'
                : 'cursor-pointer border-[var(--border)] text-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--on-border)]',
            )}
            onClick={() => {
              PywebviewApi.pasteText().then((content) => {
                onSetValue(promptKey, content);
              });
            }}
            disabled={isFrozen}
          >
            <ClipboardPaste className='size-4' />
          </button>
          <button
            type='button'
            tabIndex={0}
            className={cn(
              'flex justify-center items-center p-1.5 rounded-md cursor-pointer border border-[var(--border)]',
              isFrozen
                ? 'bg-[var(--border)] text-[var(--on-border)]'
                : 'bg-transparent text-[var(--border)]',
            )}
            onClick={() => onSetFrozen(promptKey)}
          >
            <Snowflake className='size-4' />
          </button>
          <button
            type='button'
            tabIndex={0}
            className='flex justify-center items-center p-1.5 rounded-md cursor-pointer bg-transparent border border-[var(--border)] text-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--on-border)]'
            onClick={() => onDelete(promptKey)}
          >
            <Trash2 className='size-4' />
          </button>
        </div>
        <textarea
          id={`input-${promptKey}`}
          tabIndex={0}
          className={`${styles.surfaceScrollable} bg-[var(--bg)] min-w-24 h-20 text-sm text-[var(--on-bg)] resize-none px-2 py-1 border border-[var(--border)] rounded-md focus-visible:outline-1 focus-visible:outline-[var(--primary)] focus-visible:border-[var(--primary)]`}
          value={promptValue}
          onChange={(e) => onSetValue(promptKey, e.target.value)}
          disabled={isFrozen}
          spellCheck={false}
        />
      </div>
    );
  },
);
