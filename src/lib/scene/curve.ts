export interface CurveGeometry {
  line: string;
  area: string;
  points: Array<{ x: number; y: number }>;
}

/**
 * Constrói a curva (linha + área + pontos) dentro de um retângulo qualquer —
 * usado para "escrever" o gráfico na lousa respeitando a moldura.
 */
export function buildCurve(
  values: number[],
  width: number,
  height: number,
  padding: number = 0
): CurveGeometry {
  // Sem pelo menos dois pontos não existe curva (e a divisão por zero daria NaN)
  if (values.length < 2) {
    return { line: '', area: '', points: [] };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const step = usableWidth / (values.length - 1);

  const points = values.map((value, index) => ({
    x: padding + index * step,
    y: padding + usableHeight - ((value - min) / range) * usableHeight,
  }));

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

  const area = `${line} L${(padding + usableWidth).toFixed(1)} ${(padding + usableHeight).toFixed(
    1
  )} L${padding.toFixed(1)} ${(padding + usableHeight).toFixed(1)} Z`;

  return { line, area, points };
}
