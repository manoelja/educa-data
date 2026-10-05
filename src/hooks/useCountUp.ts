import { useEffect, useRef, useState } from 'react';
import { interpolateCount } from '../lib/format';

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Anima de 0 até `target` quando o elemento entra na viewport, usando
 * IntersectionObserver + requestAnimationFrame (sem dependências externas).
 */
export function useCountUp(target: number, decimals: number = 0, duration: number = 1400) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Com movimento reduzido o valor final já nasce pronto no estado inicial —
  // evita setState síncrono dentro do efeito (cascading renders).
  const [value, setValue] = useState(() =>
    prefersReducedMotion() ? interpolateCount(target, 1, decimals) : 0
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion()) return;

    let frame = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = (timestamp - start) / duration;
      // easeOutCubic: desacelera no fim, dando sensação de contagem travando
      const eased = 1 - Math.pow(1 - Math.min(progress, 1), 3);
      setValue(interpolateCount(target, eased, decimals));

      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            frame = requestAnimationFrame(step);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, decimals, duration]);

  return { ref, value };
}
