import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ENERGY_META } from '../data/catalog';
import { ENERGY_TYPES, type CostType } from '../game/types';

const ENERGIES: CostType[] = [...ENERGY_TYPES, 'any'];
const FRAME = 64;
const RENDER_SCALE = 4;
const ORB_RADIUS = 28.5;
const INNER_RADIUS = 26.5;
const BLANK_FRAME_INDEX = ENERGIES.length;
const FRAME_COUNT = ENERGIES.length + 1;
const ANY_META = { symbol: '✱', label: 'Any', color: '#f2f2f0' };

let cachedSheet: string | null = null;
const sheetListeners = new Set<() => void>();

function energyMeta(energy: CostType) {
  return energy === 'any' ? ANY_META : ENERGY_META[energy];
}

function circle(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
}

// This is the HyperTCGMaker orb renderer, kept here as the shared visual source of truth.
function drawGlossyOrb(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
  context.save();
  context.shadowColor = 'rgba(0, 0, 0, 0.35)';
  context.shadowBlur = 2;
  context.shadowOffsetY = 1;
  circle(context, x, y, ORB_RADIUS);
  const rim = context.createLinearGradient(x - 18, y - 22, x + 20, y + 24);
  rim.addColorStop(0, '#ffffff');
  rim.addColorStop(0.16, color);
  rim.addColorStop(0.72, color);
  rim.addColorStop(1, '#202025');
  context.fillStyle = rim;
  context.fill();

  context.shadowColor = 'transparent';
  circle(context, x, y, INNER_RADIUS);
  context.fillStyle = color;
  context.fill();
  context.clip();

  const glassGlow = context.createRadialGradient(x - 11, y - 13, 1, x - 8, y - 9, 24);
  glassGlow.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
  glassGlow.addColorStop(0.2, 'rgba(255, 255, 255, 0.58)');
  glassGlow.addColorStop(0.52, 'rgba(255, 255, 255, 0.08)');
  glassGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = glassGlow;
  context.fillRect(x - ORB_RADIUS, y - ORB_RADIUS, ORB_RADIUS * 2, ORB_RADIUS * 2);

  const lowerShade = context.createLinearGradient(x, y - 15, x, y + 28);
  lowerShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
  lowerShade.addColorStop(0.56, 'rgba(0, 0, 0, 0.06)');
  lowerShade.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
  context.fillStyle = lowerShade;
  context.fillRect(x - ORB_RADIUS, y - ORB_RADIUS, ORB_RADIUS * 2, ORB_RADIUS * 2);

  const edgeShade = context.createRadialGradient(x, y - 2, 12, x, y, INNER_RADIUS);
  edgeShade.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
  edgeShade.addColorStop(0.86, 'rgba(0, 0, 0, 0.08)');
  edgeShade.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
  context.fillStyle = edgeShade;
  context.fillRect(x - ORB_RADIUS, y - ORB_RADIUS, ORB_RADIUS * 2, ORB_RADIUS * 2);

  const reflectedLight = context.createRadialGradient(x + 16, y + 17, 0, x + 16, y + 17, 13);
  reflectedLight.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
  reflectedLight.addColorStop(0.22, 'rgba(255, 255, 255, 0.32)');
  reflectedLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = reflectedLight;
  context.fillRect(x, y, INNER_RADIUS, INNER_RADIUS);

  context.beginPath();
  context.ellipse(x - 7, y - 16, 12, 5, -0.48, 0, Math.PI * 2);
  const highlight = context.createLinearGradient(x - 18, y - 20, x + 3, y - 12);
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
  highlight.addColorStop(0.58, 'rgba(255, 255, 255, 0.34)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = highlight;
  context.fill();
  context.restore();

  circle(context, x, y, ORB_RADIUS);
  const rimLight = context.createLinearGradient(x - 18, y - 24, x + 18, y + 24);
  rimLight.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
  rimLight.addColorStop(0.4, 'rgba(255, 255, 255, 0.18)');
  rimLight.addColorStop(0.75, 'rgba(0, 0, 0, 0.24)');
  rimLight.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  context.lineWidth = 1.5;
  context.strokeStyle = rimLight;
  context.stroke();
}

function drawEnergySymbol(context: CanvasRenderingContext2D, x: number, y: number, symbol: string) {
  context.save();
  context.font = '800 28px Inter, Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'rgba(255, 255, 255, 0.52)';
  context.shadowOffsetY = 1;
  context.fillStyle = '#09090c';
  context.fillText(symbol, x, y + 2);
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 1.5;
  context.shadowOffsetY = 1.5;
  context.fillText(symbol, x, y + 1);
  context.restore();
}

function drawSheet() {
  const canvas = document.createElement('canvas');
  canvas.width = FRAME * FRAME_COUNT * RENDER_SCALE;
  canvas.height = FRAME * RENDER_SCALE;
  const context = canvas.getContext('2d')!;
  context.scale(RENDER_SCALE, RENDER_SCALE);
  const frames = [...ENERGIES.map(energyMeta), { color: ANY_META.color, symbol: '' }];
  frames.forEach((frame, index) => {
    const x = index * FRAME + FRAME / 2;
    const y = FRAME / 2;
    drawGlossyOrb(context, x, y, frame.color);
    if (frame.symbol) drawEnergySymbol(context, x, y, frame.symbol);
  });
  cachedSheet = canvas.toDataURL('image/png');
  sheetListeners.forEach((notify) => notify());
}

function useEnergySheet() {
  const [sheet, setSheet] = useState(cachedSheet);
  useEffect(() => {
    if (cachedSheet) { setSheet(cachedSheet); return; }
    const notify = () => setSheet(cachedSheet);
    sheetListeners.add(notify);
    return () => { sheetListeners.delete(notify); };
  }, []);
  return sheet;
}

if (typeof document !== 'undefined') document.fonts.ready.then(drawSheet);

function orbStyle(frameIndex: number, sheet: string | null, size: number): CSSProperties {
  return {
    '--orb-size': `${size}px`,
    backgroundImage: sheet ? `url(${sheet})` : undefined,
    backgroundSize: 'auto 100%',
    backgroundPosition: `${(frameIndex / (FRAME_COUNT - 1)) * 100}% 0`,
  } as CSSProperties;
}

function OrbCount({ value }: { value: number | 'X' }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    const text = String(value);
    context.clearRect(0, 0, 64, 64);
    context.font = '800 35.2px Inter, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    const metrics = context.measureText(text);
    const x = 32 + (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
    const y = 32 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    context.fillStyle = '#101010';
    context.fillText(text, x, y);
  }, [value]);
  return <canvas className="orb-count" ref={canvas} width={64} height={64} aria-hidden="true" />;
}

export function MakerEnergyOrb({ energy, size = 24, count }: { energy: CostType; size?: number; count?: number | 'X' }) {
  const sheet = useEnergySheet();
  const numbered = count !== undefined;
  const meta = energyMeta(energy);
  return (
    <span className="maker-energy-orb" style={orbStyle(numbered ? BLANK_FRAME_INDEX : ENERGIES.indexOf(energy), sheet, size)} role="img" aria-label={numbered ? `${count} ${meta.label} Energy` : `${meta.label} Energy`} title={meta.label}>
      {numbered && <OrbCount value={count} />}
    </span>
  );
}

export function LogoGlyph({ size = 30 }: { size?: number }) {
  return <svg width={size} height={size * 0.75} viewBox="0 0 32 24" aria-hidden="true"><path d="M2 3l10 7 4-5 4 5 10-7-7 10 5 8-10-4-2 5-2-5-10 4 5-8Z" fill="currentColor" fillRule="evenodd" /></svg>;
}

export function ApertureIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M12 3l4.2 7.3M20.8 15l-8.4 0M15.6 21.5l-4.2-7.3M3.2 15l8.4 0M8.4 2.5l4.2 7.3M3.2 9l8.4 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="12" cy="12" r="2.4" fill="currentColor" /></svg>;
}

export function CrosshairIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M10 1v5M10 14v5M1 10h5M14 10h5" stroke="currentColor" strokeWidth="1.3" /></svg>;
}
