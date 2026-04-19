import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce(func: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function debounce(...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  }

  function cancel() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = undefined;
  }
  debounce.cancel = cancel;

  return debounce;
}

