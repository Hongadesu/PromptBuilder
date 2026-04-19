import { useEffect, useState } from 'react';
import { debounce } from '@/modules/utils';

export function useIsTall() {
  const [isTall, setIsTall] = useState(window.innerHeight > 760);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsTall(window.innerHeight > 760);
    }, 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isTall,
  };
}
