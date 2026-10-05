import { motion } from 'framer-motion';
import './DrawnChart.css';

interface DrawnChartProps {
  variant: 'line' | 'bars' | 'donut';
  /** Série para a linha / barras */
  values?: number[];
  /** Percentual para o donut (0–100) */
  percent?: number;
  className?: string;
}

const VIEW = 100;

function toPath(values: number[]): string {
  if (values.length < 2) return '';

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = VIEW / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = VIEW - ((value - min) / range) * (VIEW - 18) - 9;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

const draw = { duration: 1.6, ease: 'easeOut' } as const;

/**
 * Micro-gráficos "vivos": são desenhados quando entram na viewport, como um
 * traço sendo feito no caderno — o fundo reforça o tema (aprendizagem
 * acontecendo) em vez de só decorar.
 */
const DrawnChart = ({ variant, values = [], percent = 0, className }: DrawnChartProps) => {
  const classNames = ['drawn-chart', className].filter(Boolean).join(' ');

  if (variant === 'donut') {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const target = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);

    return (
      <svg viewBox="0 0 100 100" className={classNames} aria-hidden="true">
        <circle cx="50" cy="50" r={radius} className="dc-track" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className="dc-arc"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: target }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          transform="rotate(-90 50 50)"
        />
      </svg>
    );
  }

  if (variant === 'bars') {
    const max = Math.max(...values, 1);
    const width = VIEW / (values.length * 1.7);

    return (
      <svg viewBox="0 0 100 100" className={classNames} aria-hidden="true">
        <line x1="0" y1="96" x2="100" y2="96" className="dc-baseline" />
        {values.map((value, index) => {
          const height = (value / max) * 78;
          return (
            <motion.rect
              key={index}
              x={index * width * 1.7 + width * 0.35}
              width={width}
              initial={{ y: 96, height: 0 }}
              whileInView={{ y: 96 - height, height }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...draw, delay: index * 0.08 }}
              className="dc-bar"
              rx="1.5"
            />
          );
        })}
      </svg>
    );
  }

  const path = toPath(values);

  return (
    <svg viewBox="0 0 100 100" className={classNames} aria-hidden="true">
      <line x1="0" y1="96" x2="100" y2="96" className="dc-baseline" />
      <motion.path
        d={path}
        className="dc-line"
        initial={{ pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={draw}
      />
      {values.map((value, index) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;
        const x = (index / (values.length - 1)) * VIEW;
        const y = VIEW - ((value - min) / range) * (VIEW - 18) - 9;

        return (
          <motion.circle
            key={index}
            cx={x}
            cy={y}
            r="2.2"
            className="dc-dot"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.12 }}
          />
        );
      })}
    </svg>
  );
};

export default DrawnChart;
