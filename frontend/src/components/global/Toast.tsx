import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastParams = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

declare global {
  interface WindowEventMap {
    toast: CustomEvent<ToastParams>;
  }
}

type ToastState = ToastParams & { id: number };

/**
 * Toast 顯示組件
 *
 * @example
 * // 呼叫 Toast 組件的顯示
 * window.dispatchEvent(
 *   new CustomEvent('toast', {
 *     detail: {
 *       message: '操作成功！',
 *       type: 'success', // 可選：'success' | 'error' | 'info'
 *     },
 *   })
 * );
 */
export function Toast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const handler = (e: CustomEvent<ToastParams>) => {
      const customEvent = e;
      const { message, type } = customEvent.detail;
      showToast(message, type);
    };

    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  return createPortal(
    <div className='fixed top-4 right-1/2 translate-x-1/2 space-y-2 z-9999'>
      {toasts.map((toast) => {
        let bg: string;
        switch (toast.type) {
          case 'success':
            bg = 'bg-[var(--success)]/50';
            break;
          case 'error':
            bg = 'bg-[var(--destructive)]/50';
            break;
          default:
            bg = 'bg-[var(--sidebar)]/50';
        }
        return (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-md shadow-lg font-bold text-[var(--on-sidebar)] ${bg}`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

export function showToast({ type, message }: ToastParams) {
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { message, type },
    }),
  );
}
