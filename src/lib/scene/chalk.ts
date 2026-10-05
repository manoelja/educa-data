/**
 * Paleta de giz e traços decorativos desenhados "à mão".
 *
 * Esta é a fonte única das **cores do giz colorido** (usadas pelo canvas de
 * poeira e pelos traços animados). O CSS tem os mesmos tons em tokens
 * (`--chalk-*` em `styles/global.css`) — ao mexer em um, ajuste o outro.
 */

export interface ChalkColor {
  /** Nome do tom (documenta a paleta e ajuda no teste) */
  id: string;
  /** Hex para SVG/CSS */
  hex: string;
  /** Tripla RGB para o canvas (que precisa de `rgba(r, g, b, a)`) */
  rgb: string;
}

export const CHALK_COLORS: ChalkColor[] = [
  { id: 'branco', hex: '#eef3ee', rgb: '238, 243, 238' },
  { id: 'amarelo', hex: '#f2cf72', rgb: '242, 207, 114' },
  { id: 'ciano', hex: '#8fd0e8', rgb: '143, 208, 232' },
  { id: 'rosa', hex: '#eda2b4', rgb: '237, 162, 180' },
  { id: 'verde', hex: '#9edda8', rgb: '158, 221, 168' },
];

/** Cor da paleta em ciclo (aceita índice negativo e maior que a paleta) */
export function chalkColor(index: number): ChalkColor {
  const size = CHALK_COLORS.length;
  return CHALK_COLORS[((index % size) + size) % size];
}

/**
 * Traços de giz coloridos. Cada variante é um desenho abstrato — geometria,
 * gráfico, conta — e **nunca um ícone**: são marcas de giz no quadro.
 * ViewBox de referência: 120 × 64.
 *
 * O primeiro caminho de cada variante é o "pó" (traço largo e apagado);
 * os demais são o traço firme que é desenhado na tela.
 */
export type ChalkAccentName =
  | 'underline'
  | 'bars'
  | 'wave'
  | 'circle'
  | 'arrow'
  | 'formula'
  | 'ticks';

export const CHALK_ACCENTS: Record<ChalkAccentName, string[]> = {
  // Duplo sublinhado — marca o que importa
  underline: ['M6 34 C 34 26, 74 40, 114 30', 'M16 46 C 46 38, 84 50, 108 42'],
  // Colunas crescendo (indicadores)
  bars: [
    'M8 56 L114 56',
    'M22 56 L22 30',
    'M42 56 L42 20',
    'M62 56 L62 38',
    'M82 56 L82 14',
    'M102 56 L102 26',
  ],
  // Curva de aprendizagem
  wave: ['M6 42 C 18 18, 32 62, 46 34 C 60 10, 74 58, 88 28 C 98 10, 108 26, 116 18'],
  // Círculo em volta de uma ideia
  circle: [
    'M60 10 C 92 8, 114 22, 112 34 C 110 50, 82 58, 56 56 C 28 54, 8 44, 10 30 C 12 14, 40 8, 68 12 Z',
  ],
  // Seta apontando o caminho
  arrow: ['M8 46 C 40 46, 76 34, 112 18', 'M92 11 L112 18 L95 31'],
  // Conta de giz: somatório, igual e resultado
  formula: ['M8 18 L42 18 L24 32 L42 46 L8 46', 'M56 24 L88 24', 'M56 36 L88 36', 'M56 48 L104 48'],
  // Dois "certos" de correção
  ticks: ['M10 32 L24 46 L46 12', 'M54 32 L68 46 L90 12'],
};
