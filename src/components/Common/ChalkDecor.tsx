import { motion, useReducedMotion } from 'framer-motion';
import { CHALK_ACCENTS, chalkColor } from '../../lib/scene/chalk';
import type { ChalkAccentName } from '../../lib/scene/chalk';
import './ChalkDecor.css';

interface ChalkDecorProps {
  /** Qual desenho de giz entra na tela junto com o card */
  accent: ChalkAccentName;
  /** Índice na paleta de giz — cicla automaticamente */
  color?: number;
  className?: string;
}

/**
 * Traço de giz colorido que se desenha quando o card entra na tela: é o
 * "evento de giz" de cada card — a mão invisível escrevendo junto com o
 * conteúdo. Decorativo (fica fora da árvore de acessibilidade).
 */
const ChalkDecor = ({ accent, color = 0, className }: ChalkDecorProps) => {
  const prefersReducedMotion = useReducedMotion();
  const paths = CHALK_ACCENTS[accent];
  const ink = chalkColor(color);

  // Sem movimento: o traço já aparece pronto
  const inkInitial = prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 };
  const dustInitial = prefersReducedMotion ? { opacity: 0.22 } : { opacity: 0 };

  return (
    <svg
      className={`chalk-decor${className ? ` ${className}` : ''}`}
      viewBox="0 0 120 64"
      style={{ color: ink.hex }}
      aria-hidden="true"
    >
      {paths.map((d, index) => (
        <g key={`${accent}-${index}`}>
          {/* Pó do giz: traço largo, apagado e desfocado */}
          <motion.path
            className="chalk-decor__stroke chalk-decor__stroke--dust"
            d={d}
            initial={dustInitial}
            whileInView={{ opacity: 0.22 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.06 }}
          />
          {/* Traço firme, desenhado como se a mão estivesse escrevendo */}
          <motion.path
            className="chalk-decor__stroke"
            d={d}
            initial={inkInitial}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 + index * 0.06 }}
          />
        </g>
      ))}
    </svg>
  );
};

export default ChalkDecor;
