import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import anyEnergySymbol from '../assets/energy-symbols/any.png';
import blankEnergySymbol from '../assets/energy-symbols/blank.png';
import bosonEnergySymbol from '../assets/energy-symbols/boson.png';
import electronEnergySymbol from '../assets/energy-symbols/electron.png';
import gluonEnergySymbol from '../assets/energy-symbols/gluon.png';
import muonEnergySymbol from '../assets/energy-symbols/muon.png';
import neutrinoEnergySymbol from '../assets/energy-symbols/neutrino.png';
import photonEnergySymbol from '../assets/energy-symbols/photon.png';
import { ENERGY_META } from '../data/catalog';
import type { CostType } from '../game/types';

const ENERGY_SYMBOLS: Record<CostType, string> = {
  any: anyEnergySymbol,
  boson: bosonEnergySymbol,
  electron: electronEnergySymbol,
  gluon: gluonEnergySymbol,
  muon: muonEnergySymbol,
  neutrino: neutrinoEnergySymbol,
  photon: photonEnergySymbol,
};

function energyLabel(energy: CostType) {
  return energy === 'any' ? 'Any' : ENERGY_META[energy].label;
}

function orbStyle(symbol: string, size: number): CSSProperties {
  return {
    '--orb-size': `${size}px`,
    backgroundImage: `url("${symbol}")`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
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
  const numbered = count !== undefined;
  const label = energyLabel(energy);
  const symbol = numbered ? blankEnergySymbol : ENERGY_SYMBOLS[energy];
  return (
    <span className="maker-energy-orb" style={orbStyle(symbol, size)} role="img" aria-label={numbered ? `${count} ${label} Energy` : `${label} Energy`} title={label}>
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
