import { useEffect, useRef } from 'react';
import { useRafLoop } from './useRafLoop';
import { attachPointer, getPointer, stepPointer } from '../lib/scene/pointer';

interface PointerParallaxOptions {
  /** Rotação máxima em graus (inclinação da câmera) */
  rotate?: number;
  /** Deslocamento máximo em px */
  shift?: number;
  /** Velocidade com que a câmera alcança o alvo (0–1 por frame) */
  lerp?: number;
  enabled?: boolean;
}

/**
 * Aplica inércia de câmera em um elemento: inclina e desloca de leve seguindo o
 * ponteiro. Escreve direto no `style.transform` (sem estado do React) para não
 * re-renderizar a árvore a cada movimento.
 */
export function usePointerParallax<T extends HTMLElement>({
  rotate = 2.4,
  shift = 16,
  lerp = 0.06,
  enabled = true,
}: PointerParallaxOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    attachPointer();
  }, []);

  useRafLoop(
    () => {
      stepPointer(lerp);

      const element = ref.current;
      if (!element) return;

      const { x, y } = getPointer();
      element.style.transform = `rotateX(${(-y * rotate).toFixed(3)}deg) rotateY(${(
        x * rotate
      ).toFixed(3)}deg) translate3d(${(x * shift).toFixed(2)}px, ${(y * shift).toFixed(2)}px, 0)`;
    },
    { enabled: enabled && !prefersReducedMotion, fps: 60 }
  );

  return ref;
}
