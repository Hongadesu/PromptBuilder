import { useEffect, useState } from 'react';
import { debounce } from '@/modules/utils';

export function useIsWide() {
  const [isWide, setIsWide] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsWide(window.innerWidth > 1024);
    }, 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isWide,
  };
}
