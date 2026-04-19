import { cn } from '@/modules/utils';
import { GlowCards } from '@/components/home';
import { useIsWide } from '@/hooks';

export function Home() {
  const { isWide } = useIsWide();

  return (
    <div className='flex w-full flex-1 flex-col overflow-y-auto bg-(--bg) p-4 transition-all duration-500'>
      <div className='transition-color mx-6 mt-4 flex flex-col gap-3 rounded-xl border-2 border-(--border)/50 bg-(--surface) py-3 duration-500 select-none'>
        <h1
          className={cn(
            'font-noto text-center text-(--on-bg-title)',
            isWide ? 'text-xl' : 'text-lg',
          )}
        >
          提示詞模板管理工具
        </h1>
        <p className='flex-1 content-center px-6 text-center text-sm text-(--on-surface)'>
          {'編輯、存儲提示詞的好幫手 '}
        </p>
      </div>
      <GlowCards className='mx-6 my-4' />
    </div>
  );
}
