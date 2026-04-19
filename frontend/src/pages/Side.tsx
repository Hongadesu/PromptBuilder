import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Github,
  Moon,
  PictureInPicture2,
  Settings,
  Sun,
  Undo2,
} from 'lucide-react';
import { Button, Logo, Tooltip } from '@/components/global';
import { useIsWide } from '@/hooks';
import { useGlobalStore, useThemeStore, useSideStateStore } from '@/stores';
import { TemplatePinList } from '@/features/pin/TemplatePinList';
import { PywebviewApi } from '@/apis/pywebviewApi';
import { cn } from '@/modules/utils';
import styles from '@/styles/Scrollbar.module.css';

interface SideMenuProps {
  className?: string;
}

export function SideMenu({ className }: SideMenuProps) {
  const navigate = useNavigate();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore.getState().toggleTheme;
  const alwaysOnTop = useGlobalStore((state) => state.alwaysOnTop);
  const setAlwaysOnTop = useGlobalStore.getState().setAlwaysOnTop;
  const setSideOpen = useSideStateStore.getState().setSideOpen;

  const { isWide } = useIsWide();
  const sidemenuRef = useRef<HTMLDivElement | null>(null);

  // 當 "窗體寬度足夠小" 且 "點擊 sidemenu 以外的元素" 時，就關閉 sidemenu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!sidemenuRef.current) {
        return;
      }

      if (
        useSideStateStore.getState().isSideOpen &&
        !isWide &&
        !sidemenuRef.current.contains(e.target as Node)
      ) {
        e.stopPropagation();
        setSideOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isWide]);

  return (
    <div ref={sidemenuRef} className={cn('relative bg-[var(--bg)]', className)}>
      <div className='absolute top-0 right-0 bottom-0 left-0 h-full rounded-r-2xl bg-[var(--sidebar)] py-6 pr-2'>
        <div
          className={cn('h-full min-w-64 overflow-y-auto', styles.scrollable)}
        >
          <div className='sticky top-0 left-0 mb-2 flex items-center bg-[var(--sidebar)] pr-2 pb-4 pl-4'>
            <Link to='/home' className='flex-1'>
              <Logo />
            </Link>
            <div className='ml-auto flex gap-1'>
              <TopButton
                title={'亮暗模式切換'}
                className='p-1 text-[var(--on-sidebar)]'
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon /> : <Sun />}
              </TopButton>
              <TopButton
                title={'上一頁'}
                className='p-1 text-[var(--on-sidebar)]'
                onClick={() => navigate(-1)}
              >
                <Undo2 />
              </TopButton>
            </div>
          </div>
          <div className='flex flex-col gap-4 pr-6 pb-16 pl-4'>
            <TemplatePinList />
          </div>
          {/* 設置按鈕 */}
          <div className='absolute bottom-0 left-0 flex h-16 w-full items-center justify-center gap-8 backdrop-blur-lg'>
            {/* Project Github Link */}
            <Button
              title='關注項目'
              type='button'
              variant='ghost'
              className='p-1 text-[var(--on-sidebar)]'
              onClick={() => PywebviewApi.openProjectLink()}
            >
              <Tooltip content='關注項目' side='top' delayDuration={500}>
                <Github />
              </Tooltip>
            </Button>
            {/* AlwaysOnTop */}
            <Button
              title='保持最上層'
              type='button'
              variant='ghost'
              className={cn(
                'p-1 text-[var(--on-sidebar)]',
                alwaysOnTop &&
                  'bg-[var(--secondary)] text-[var(--on-secondary)]',
              )}
              onClick={() =>
                (async () => {
                  const newState = !alwaysOnTop;
                  const success = await PywebviewApi.setAlwaysOnTop(newState);
                  if (!success) {
                    return;
                  }
                  setAlwaysOnTop(newState);
                })()
              }
            >
              <Tooltip content='保持最上層' side='top' delayDuration={500}>
                <PictureInPicture2 />
              </Tooltip>
            </Button>
            {/* Setting */}
            <Button
              title='應用設置'
              type='button'
              variant='ghost'
              className='p-1 text-[var(--on-sidebar)]'
              onClick={() => navigate('/setting')}
            >
              <Tooltip content='應用設置' side='top' delayDuration={500}>
                <Settings />
              </Tooltip>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TopButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title: string;
}

function TopButton({ className, children, onClick, title }: TopButtonProps) {
  return (
    <button
      type='button'
      tabIndex={0}
      title={title}
      className={cn(
        'cursor-pointer rounded-md bg-transparent text-sm font-bold text-[var(--border)] transition-colors duration-500 hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
