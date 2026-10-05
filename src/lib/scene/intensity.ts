/**
 * Calibração rápida da cena por URL — sem mexer no CSS:
 *
 *   localhost:5173/?scene=0.5   → metade da intensidade
 *   localhost:5173/?scene=0     → cena desligada
 *   localhost:5173/?scene=1.4   → reforçada
 *
 * Escreve em `--scene-intensity` (o multiplicador único de todas as camadas).
 */
const PARAM = 'scene';
const MIN = 0;
const MAX = 2;

export function applySceneIntensityFromUrl(search: string): number | null {
  const raw = new URLSearchParams(search).get(PARAM);
  if (raw === null || raw.trim() === '') return null;

  const value = Number(raw);
  if (!Number.isFinite(value)) return null;

  const clamped = Math.min(Math.max(value, MIN), MAX);
  document.documentElement.style.setProperty('--scene-intensity', String(clamped));

  return clamped;
}
