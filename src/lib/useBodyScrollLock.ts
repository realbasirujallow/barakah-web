'use client';

import { useEffect } from 'react';

const locks = new WeakMap<HTMLElement, { count: number; overflow: string }>();

/** All modal owners share one lock, regardless of their cleanup order. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const body = document.body;
    const lock = locks.get(body) ?? { count: 0, overflow: body.style.overflow };
    locks.set(body, lock);
    lock.count += 1;
    body.style.overflow = 'hidden';
    return () => {
      lock.count -= 1;
      if (lock.count === 0) {
        body.style.overflow = lock.overflow;
        locks.delete(body);
      }
    };
  }, [active]);
}
