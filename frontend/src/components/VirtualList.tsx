import React, { useState, useRef, UIEvent } from 'react';
import styles from '@/styles/Scrollbar.module.css';

type VirtualListProps<T> = {
  data: T[];
  rowHeight: number;
  containerHeight: number;
  overscanCount?: number; // 緩衝渲染項目數
  renderRow: (item: T, index: number) => React.ReactNode;
};

export function VirtualList<T>({
  data,
  rowHeight,
  containerHeight,
  renderRow,
  overscanCount = 5,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = data.length * rowHeight;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - overscanCount,
  );
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscanCount,
  );

  const visibleItems = data.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`${styles.scrollable} overflow-y-auto`}
      style={{
        height: containerHeight,
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <ul style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderRow(item, startIndex + index),
          )}
        </ul>
      </div>
    </div>
  );
}
