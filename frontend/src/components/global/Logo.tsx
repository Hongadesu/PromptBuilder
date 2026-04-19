import { useState } from 'react';
import { cn } from '@/modules/utils';
import styles from './Logo.module.css';

export function Logo() {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className='w-full font-noto select-none cursor-pointer whitespace-pre text-xl text-[var(--on-sidebar)] transition-colors duration-500'
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <span>{'${'}</span>
      <span className={cn(styles.logo, isActive && styles.active)}></span>
      <span>{'}'}</span>
    </div>
  );
}
