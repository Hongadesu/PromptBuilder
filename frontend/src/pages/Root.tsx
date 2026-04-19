import { Outlet } from 'react-router';
import { SideMenu } from '@/pages/Side';
import { Toast } from '@/components/global';
import { useSideStateStore } from '@/stores';
import { cn } from '@/modules/utils';
import styles from '@/styles/SideResponsive.module.css';

export function Root() {
  const isSideOpen = useSideStateStore((state) => state.isSideOpen);

  return (
    <>
      <div className='w-full h-full flex relative'>
        <SideMenu
          className={cn(
            styles.sidemenu,
            'h-full shrink-0 grow-0 transition-all duration-500 overflow-hidden',
            isSideOpen ? 'w-72' : 'w-0',
          )}
        />
        <SideFoldTrigger />
        <Outlet />
      </div>
      <Toast />
    </>
  );
}

function SideFoldTrigger() {
  const isSideOpen = useSideStateStore((state) => state.isSideOpen);
  const setSideOpen = useSideStateStore.getState().setSideOpen;

  return (
    <div
      className={cn(
        styles.sidefoldTrigger,
        'relative h-full overflow-visible bg-[var(--bg)] transition-all duration-500',
        isSideOpen ? 'basis-6 shrink-0' : `basis-0 ${styles.fold}`,
      )}
    >
      <button
        className={cn(
          `group absolute top-0 bottom-0 my-auto h-16 w-6 -space-y-1 cursor-pointer flex flex-col items-center justify-center
        [&>*]:w-1 [&>*]:h-4 [&>*]:bg-[var(--secondary)] hover:[&>*]:bg-[var(--primary)] [&>*]:rounded-full [&>*]:transition-transform`,
          isSideOpen ? 'left-0' : 'left-2',
        )}
        type='button'
        title='Toggle side'
        onClick={(e) => {
          e.stopPropagation();
          setSideOpen(!isSideOpen);
        }}
      >
        {isSideOpen ? (
          <>
            <div className='group-hover:rotate-[20deg]'></div>
            <div className='group-hover:-rotate-[20deg]'></div>
          </>
        ) : (
          <>
            <div className='group-hover:-rotate-[20deg]'></div>
            <div className='group-hover:rotate-[20deg]'></div>
          </>
        )}
      </button>
    </div>
  );
}

