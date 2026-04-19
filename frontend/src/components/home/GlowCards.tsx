import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '@/modules/utils';
import styles from './GlowCards.module.css';

export function GlowCards({ className }: { className?: string }) {
  const { cardCtr } = useGlowCard();
  const navigate = useNavigate();

  return (
    <div
      ref={cardCtr}
      className={cn(
        'min-h-40 flex-1 grid grid-cols-2 grid-rows-2 gap-4 select-none max-md:grid-cols-1 max-md:grid-rows-4',
        className,
      )}
    >
      {/* ${我的模板} */}
      <Card
        className={`${styles.card} cursor-pointer hover:bg-[var(--primary)] hover:text-[var(--on-primary)]`}
        onClick={() => navigate('/prompt')}
      >
        <CardLogo
          cssClassName={styles.myTemplate}
          className='text-sm min-sm:text-lg min-md:text-xl'
        />
      </Card>
      {/* ${單段落速填模板} */}
      <Card
        className={`${styles.card} cursor-pointer hover:bg-[var(--primary)] hover:text-[var(--on-primary)]`}
        onClick={() => navigate('/quickfill')}
      >
        <CardLogo
          cssClassName={styles.quickGroup}
          className='text-sm min-sm:text-lg min-md:text-xl'
        />
      </Card>
      {/* ${群組} */}
      <Card
        className={`${styles.card} cursor-pointer hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]`}
        onClick={() => navigate('/group')}
      >
        <CardLogo
          cssClassName={styles.group}
          className='text-sm min-sm:text-lg min-md:text-xl'
        />
      </Card>
      {/* ${新增/測試模板} */}
      <Card
        className={`${styles.card} cursor-pointer hover:bg-[var(--border)] hover:text-[var(--on-border)]`}
        onClick={() => navigate('/test/default')}
      >
        <CardLogo
          cssClassName={styles.test}
          className='text-sm min-sm:text-lg min-md:text-xl'
        />
      </Card>
      {/* ${敬請期待...} */}
      {/* <Card
        className={`${styles.card} text-[var(--on-muted)] transition-all duration-500`}
      >
        <span className='text-sm min-sm:text-lg min-md:text-xl'>
          {'${敬請期待...}'}
        </span>
      </Card> */}
    </div>
  );
}

function Card({
  children,
  onClick,
  className,
  innerClassName,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl font-noto text-[var(--on-bg-title)] text-xl text-center bg-[var(--surface)] transition-all duration-500',
        className,
      )}
      onClick={onClick}
    >
      <div className={cn(styles.inner, 'content-center', innerClassName)}>
        {children}
      </div>
    </div>
  );
}

function useGlowCard() {
  const cardCtr = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = cardCtr.current;
    if (!container) return;

    const cards = container.querySelectorAll(`.${styles.card}`);

    const handleMouseMove = (e: MouseEvent) => {
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget || (e.relatedTarget as Node).nodeName === 'HTML') {
        for (const card of cards) {
          (card as HTMLElement).style.setProperty('--mouse-x', '-999999px');
          (card as HTMLElement).style.setProperty('--mouse-y', '-999999px');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return {
    cardCtr,
  };
}

function CardLogo({
  cssClassName,
  className,
}: {
  cssClassName: string;
  className?: string;
}) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={cn(
        'w-full font-noto select-none cursor-pointer whitespace-pre text-inherit transition-colors duration-500',
        className,
      )}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <span>{'${'}</span>
      <span className={cn(cssClassName, isActive && styles.active)}></span>
      <span>{'}'}</span>
    </div>
  );
}
