import { motion, useReducedMotion } from 'framer-motion';
import { chalkColor } from '../../lib/scene/chalk';
import './SectionChalk.css';

interface SectionChalkProps {
  section: string;
}

/** Rabisco de onda vertical + 2 traços tortos (padrão de cada seção) */
const WaveScribble = ({ colorIndex, side = 'left' }: { colorIndex: number; side?: 'left' | 'right' }) => {
  const prefersReducedMotion = useReducedMotion();
  const ink = chalkColor(colorIndex);
  const ink2 = chalkColor(colorIndex + 2);

  const dustInit = prefersReducedMotion ? { opacity: 0.2 } : { opacity: 0 };
  const lineInit = prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 };

  return (
    <svg
      className={`wave-scribble wave-scribble--${side}`}
      viewBox="0 0 40 600"
      style={{ color: ink.hex }}
    >
      {/* Onda de cima */}
      <motion.path
        className="wave-scribble__dust"
        d="M20 0 C 28 25, 12 50, 20 75 C 28 100, 12 125, 20 150 C 28 175, 12 200, 20 225 C 28 250, 12 270, 20 280"
        initial={dustInit}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        className="wave-scribble__line"
        d="M20 0 C 28 25, 12 50, 20 75 C 28 100, 12 125, 20 150 C 28 175, 12 200, 20 225 C 28 250, 12 270, 20 280"
        initial={lineInit}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
      />
      {/* Traços centrais */}
      <motion.line
        className="wave-scribble__dash"
        x1="4" y1="305" x2="36" y2="315"
        style={{ stroke: ink2.hex }}
        initial={lineInit}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.line
        className="wave-scribble__dash"
        x1="4" y1="345" x2="36" y2="335"
        style={{ stroke: ink2.hex }}
        initial={lineInit}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      />
      {/* Onda de baixo */}
      <motion.path
        className="wave-scribble__dust"
        d="M20 370 C 28 395, 12 420, 20 445 C 28 470, 12 495, 20 520 C 28 545, 12 570, 20 590 C 28 600, 12 600, 20 600"
        initial={dustInit}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.path
        className="wave-scribble__line"
        d="M20 370 C 28 395, 12 420, 20 445 C 28 470, 12 495, 20 520 C 28 545, 12 570, 20 590 C 28 600, 12 600, 20 600"
        initial={lineInit}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
      />
    </svg>
  );
};

/** Rabiscos extras por seção (além da onda padrão) */
const EXTRA_SCRIBBLES: Record<string, { d: string; x: number; y: number; w: number; h: number; color: number; rotation?: number }[]> = {
  hero: [
    { d: 'M5 40 L 45 40 M25 20 L 25 55', x: 8, y: 75, w: 55, h: 60, color: 0, rotation: 3 },
  ],
  about: [
    { d: 'M8 44 L 38 44 L 22 24 L 38 4 L 8 4 L 8 44 Z', x: 60, y: 8, w: 50, h: 55, color: 2 },
    { d: 'M4 20 C 20 8, 40 32, 56 16 C 68 6, 80 18, 92 12', x: 55, y: 65, w: 100, h: 40, color: 1, rotation: 8 },
  ],
  sources: [
    { d: 'M6 34 C 22 14, 42 48, 58 28 C 70 14, 82 30, 94 20', x: 60, y: 12, w: 105, h: 50, color: 3 },
  ],
  analyses: [
    { d: 'M8 50 L8 30 M18 50 L18 18 M28 50 L28 36 M38 50 L38 12 M48 50 L48 24 M58 50 L58 8', x: 55, y: 6, w: 65, h: 55, color: 4 },
    { d: 'M10 10 C 28 6, 42 18, 40 32 C 38 44, 22 48, 12 40 C 4 34, 4 16, 10 10 Z', x: 75, y: 60, w: 50, h: 55, color: 1 },
  ],
  dashboard: [
    { d: 'M30 8 C 50 4, 58 16, 56 30 C 54 42, 38 50, 26 46 C 14 42, 8 28, 10 16 C 12 8, 22 4, 30 8 Z', x: 60, y: 8, w: 65, h: 55, color: 3 },
    { d: 'M18 28 L26 36 L42 18', x: 62, y: 20, w: 35, h: 30, color: 4, rotation: 5 },
  ],
  contact: [
    { d: 'M4 14 L 28 28 L 52 14', x: 60, y: 8, w: 58, h: 35, color: 1 },
    { d: 'M4 14 L 4 40 L 52 40 L 52 14 L 28 30 L 4 14 Z', x: 60, y: 8, w: 58, h: 45, color: 0 },
  ],
};

const SectionChalk = ({ section }: SectionChalkProps) => {
  const prefersReducedMotion = useReducedMotion();
  const extras = EXTRA_SCRIBBLES[section] || [];

  return (
    <div className="section-chalk" aria-hidden="true">
      {/* Onda vertical + traços tortos — lado esquerdo */}
      <WaveScribble colorIndex={section === 'hero' ? 1 : section === 'about' ? 2 : section === 'sources' ? 3 : section === 'analyses' ? 4 : section === 'dashboard' ? 0 : 1} />
      {/* Onda vertical + traços tortos — lado direito */}
      <WaveScribble colorIndex={section === 'hero' ? 3 : section === 'about' ? 4 : section === 'sources' ? 0 : section === 'analyses' ? 1 : section === 'dashboard' ? 2 : 3} side="right" />

      {/* Rabiscos extras específicos de cada seção */}
      {extras.map((mark, i) => {
        const ink = chalkColor(mark.color);
        return (
          <svg
            key={`${section}-extra-${i}`}
            className="section-chalk__svg"
            viewBox={`0 0 ${mark.w} ${mark.h}`}
            style={{
              left: `${mark.x}%`,
              top: `${mark.y}%`,
              width: `${mark.w * 0.55}px`,
              color: ink.hex,
              transform: mark.rotation ? `rotate(${mark.rotation}deg)` : undefined,
            }}
          >
            <motion.path
              className="section-chalk__dust"
              d={mark.d}
              initial={prefersReducedMotion ? { opacity: 0.18 } : { opacity: 0 }}
              whileInView={{ opacity: 0.18 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            <motion.path
              className="section-chalk__line"
              d={mark.d}
              initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 + i * 0.1 }}
            />
          </svg>
        );
      })}
    </div>
  );
};

export default SectionChalk;
