import React, { useState } from 'react';

export interface SnapsterLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'burgundy' | 'card' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStar?: boolean;
  showElephant?: boolean;
  showTagline?: boolean;
  useImage?: boolean;
}

export const SnapsterLogo: React.FC<SnapsterLogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showStar = true,
  showElephant = false,
  showTagline = false,
  useImage = true,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Height presets maintaining exact 4:1 logo aspect ratio
  const heightStyles = {
    xs: 'h-6 sm:h-7',
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9 md:h-10',
    lg: 'h-10 sm:h-12 md:h-14',
    xl: 'h-14 sm:h-16 md:h-20',
  };

  // Select the appropriate official extracted image asset
  let logoSrc = '/images/snapster-logo-white.png';
  if (variant === 'card') {
    logoSrc = '/images/snapster-logo-card.png';
  } else if (variant === 'burgundy' || variant === 'dark') {
    logoSrc = '/images/snapster-logo-burgundy.png';
  } else {
    // 'light' or 'white'
    logoSrc = '/images/snapster-logo-white.png';
  }

  // Fallback text colors if image is unavailable or loading fails
  const textColor =
    variant === 'light' || variant === 'white'
      ? '#F6F1E9'
      : variant === 'burgundy'
      ? '#700415'
      : '#111011';

  return (
    <div
      className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}
      role="img"
      aria-label="SNAPSTER — YOUR DAY. YOUR DRIP."
    >
      {useImage && !imageFailed ? (
        <img
          src={logoSrc}
          alt="SNAPSTER Logo"
          className={`${heightStyles[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        /* Crisp Vector Fallback mimicking the official Canva wordmark & star */
        <div
          className={`flex flex-col items-center leading-none ${heightStyles[size]} justify-center`}
          style={{ color: textColor }}
        >
          <div className="relative flex items-center font-black italic tracking-tighter uppercase">
            <span
              style={{
                fontFamily: "'Syne', 'Plus Jakarta Sans', 'Arial Black', sans-serif",
                letterSpacing: '-0.04em',
                transform: 'skewX(-10deg)',
                display: 'inline-block',
                fontSize: size === 'xl' ? '2.2rem' : size === 'lg' ? '1.75rem' : size === 'md' ? '1.35rem' : '1.1rem',
              }}
            >
              SNAPSTER
            </span>

            {/* Dynamic 4-point crosshair star symbol from official logo */}
            {showStar && (
              <svg
                className="inline-block ml-0.5 -mt-1.5 shrink-0 fill-current"
                style={{
                  width: size === 'xl' ? '1.5rem' : size === 'lg' ? '1.25rem' : '1rem',
                  height: size === 'xl' ? '1.5rem' : size === 'lg' ? '1.25rem' : '1rem',
                }}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 0 L26.5 19 L46 22 L26.5 25 L24 48 L21.5 25 L2 22 L21.5 19 Z"
                  fill="currentColor"
                />
              </svg>
            )}

            <span className="text-[0.4em] font-sans font-bold not-italic ml-0.5 -mt-3.5 opacity-80">
              ®
            </span>
          </div>

          {(showTagline || size === 'lg' || size === 'xl') && (
            <span
              className="text-[0.45em] tracking-[0.25em] font-mono font-bold uppercase opacity-85 mt-0.5"
              style={{ letterSpacing: '0.22em' }}
            >
              YOUR DAY. YOUR DRIP.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
