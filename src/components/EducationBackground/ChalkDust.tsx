import { useEffect, useRef } from 'react';
import { useRafLoop } from '../../hooks/useRafLoop';
import { attachPointer, getPointer, stepPointer } from '../../lib/scene/pointer';
import { drift } from '../../lib/scene/noise';
import { projectBlur, projectScale } from '../../lib/scene/projection';
import { CHALK_COLORS } from '../../lib/scene/chalk';
import './ChalkDust.css';

interface Dust {
  x: number;
  y: number;
  z: number;
  radius: number;
  speed: number;
  seed: number;
  /** Índice na paleta de giz — a maior parte é giz branco */
  color: number;
}

const SPRITE_SIZE = 64;
const MAX_PARTICLES = 150;
const TAU = Math.PI * 2;
/** Proporção de partículas que ganham cor de giz (o resto é giz branco) */
const COLORED_RATIO = 0.3;

/** Sprite de brilho suave, um por cor de giz (evita criar gradiente por partícula) */
function createSprite(rgb: string): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;

  const ctx = sprite.getContext('2d');
  if (ctx) {
    const half = SPRITE_SIZE / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, `rgba(${rgb}, 0.95)`);
    gradient.addColorStop(0.35, `rgba(${rgb}, 0.35)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }

  return sprite;
}

/**
 * Poeira de giz no ar do quadro. Cada partícula tem profundidade (z) e é
 * projetada em perspectiva: muda de tamanho, brilho e desfoque conforme a
 * distância — é isso que dá a sensação de volume em vez de "pontinhos".
 * Boa parte é giz branco; o resto carrega uma cor da paleta.
 */
const ChalkDust = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const spritesRef = useRef<HTMLCanvasElement[]>([]);
  const dustRef = useRef<Dust[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    spritesRef.current = CHALK_COLORS.map((color) => createSprite(color.rgb));

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width, height };

      // Menos partículas no mobile: mesmo efeito, menos pintura por frame
      const density = width < 700 ? 26000 : 14000;
      const count = Math.min(MAX_PARTICLES, Math.round((width * height) / density));

      dustRef.current = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: -420 + Math.random() * 740,
        radius: 0.9 + Math.random() * 1.9,
        speed: 0.06 + Math.random() * 0.22,
        seed: index * 3.7,
        color:
          Math.random() < COLORED_RATIO
            ? 1 + Math.floor(Math.random() * (CHALK_COLORS.length - 1))
            : 0,
      }));
    };

    attachPointer();
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      ctxRef.current = null;
    };
  }, []);

  useRafLoop((delta) => {
    const ctx = ctxRef.current;
    const sprites = spritesRef.current;
    if (!ctx || sprites.length === 0) return;

    const { width, height } = sizeRef.current;
    if (width === 0) return;

    stepPointer(0.05);
    const pointer = getPointer();
    const step = delta / 16.7;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dustRef.current.length; i++) {
      const dust = dustRef.current[i];

      // Subida lenta + desvio orgânico (ruído em vez de senoide previsível)
      dust.y -= dust.speed * step;
      dust.x += drift(dust.y * 0.004 + i, dust.seed) * 0.16 * step;

      if (dust.y < -40) {
        dust.y = height + 40;
        dust.x = Math.random() * width;
      }
      if (dust.x < -40) dust.x = width + 40;
      if (dust.x > width + 40) dust.x = -40;

      const scale = projectScale(dust.z);
      const blur = projectBlur(dust.z, 0, 0.013, 5.5);

      // Parallax proporcional à proximidade: o que está perto anda mais
      const x = centerX + (dust.x - centerX) * scale + pointer.x * (10 + scale * 26);
      const y = centerY + (dust.y - centerY) * scale + pointer.y * (8 + scale * 18);

      const radius = dust.radius * scale;
      const diameter = (radius + blur) * 2.4;
      const depthFade = 1 - Math.min(Math.abs(dust.z) / 620, 0.72);
      const alpha = Math.min(dust.speed * 3.1 * depthFade, 0.5);

      ctx.globalAlpha = alpha;
      ctx.drawImage(
        sprites[dust.color],
        x - diameter / 2,
        y - diameter / 2,
        diameter,
        diameter
      );

      // Núcleo nítido só no que está perto — realça o contraste de foco
      if (blur < 1.2) {
        ctx.globalAlpha = Math.min(alpha * 1.5, 0.6);
        ctx.fillStyle = `rgb(${CHALK_COLORS[dust.color].rgb})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(radius * 0.45, 0.35), 0, TAU);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }, { fps: 45 });

  return <canvas ref={canvasRef} className="chalk-dust" aria-hidden="true" />;
};

export default ChalkDust;
