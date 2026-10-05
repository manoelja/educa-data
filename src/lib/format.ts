/**
 * Formata um número no padrão pt-BR (1.234.567), preservando as casas decimais
 * pedidas. Usado pelos indicadores da landing e pela animação de contagem.
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Interpola a contagem: devolve o valor em `progress` (0 → 1) do caminho entre
 * 0 e `target`, respeitando as casas decimais. Extraído do hook `useCountUp`
 * para poder ser testado sem timers.
 */
export function interpolateCount(target: number, progress: number, decimals: number = 0): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const factor = Math.pow(10, decimals);
  return Math.round(target * clamped * factor) / factor;
}
