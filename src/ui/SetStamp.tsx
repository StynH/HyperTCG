import type { CSSProperties, ReactNode } from 'react';
import origLogo from '../assets/set-logos/orig.png';
import fourLogo from '../assets/set-logos/four.png';

export const SET_LOGOS: Record<string, string> = {
  ORIG: origLogo,
  FOUR: fourLogo,
};

interface CardDisplayProps {
  image: string;
  alt: string;
  setId: string;
  isStamped?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function CardDisplay({
  image,
  alt,
  setId,
  isStamped = false,
  className = '',
  style,
  children,
}: CardDisplayProps) {
  return (
    <span className={`card-display ${className}`.trim()} style={style}>
      <img className="card-display-image" src={image} alt={alt} />
      {isStamped && <SetStamp setId={setId} />}
      {children}
    </span>
  );
}

export function SetStamp({ setId }: { setId: string }) {
  const logo = SET_LOGOS[setId];
  if (!logo) return null;
  return (
    <span className="set-stamp" aria-hidden="true" style={{ '--stamp-logo': `url(${logo})` } as CSSProperties}>
      <img src={logo} alt="" />
      <i className="set-stamp-holo" />
    </span>
  );
}
