import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BrandSplashScreen: React.FC = () => {
  const { setCurrentView } = useStore();
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Check if the user has already entered the store in this session
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('snapster_entered') !== 'true';
    }
    return true;
  });

  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleShiftToHome = useCallback(() => {
    if (isFadingOut || !isVisible) return;

    setIsFadingOut(true);
    // Remember that customer has entered the store so Snapster remains open
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('snapster_entered', 'true');
    }

    // Set view to home page
    setCurrentView('home');

    // Smooth fade out duration then unmount
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
    }, 450);
  }, [isFadingOut, isVisible, setCurrentView]);

  // Auto-shift to the home page after 2.2 seconds
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      handleShiftToHome();
    }, 2200);

    return () => clearTimeout(timer);
  }, [isVisible, handleShiftToHome]);

  // Keyboard accessibility: press any key to enter
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        handleShiftToHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleShiftToHome]);

  if (!isVisible) return null;

  return (
    <div
      onClick={handleShiftToHome}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 bg-[#0E0D0E] text-[#F6F1E9] select-none cursor-pointer transition-all duration-450 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="SNAPSTER Brand Welcome"
    >
      {/* Background Radial Brand Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(112, 4, 21, 0.42) 0%, rgba(14, 13, 14, 0.92) 65%, #0E0D0E 100%)',
        }}
      />

      {/* Top subtle badge */}
      <div className="relative z-10 flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C7BDB7]/75">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span>OFFICIAL STOREFRONT // AUTUMN WINTER 2026</span>
      </div>

      {/* Center Hero: SNAPSTER Logo & Tagline */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Glow halo behind logo */}
        <div className="absolute -inset-10 bg-red-700/20 blur-3xl rounded-full pointer-events-none" />

        {/* Snapster Official Logo Display */}
        <div className="relative mb-5 transform transition-transform duration-300 hover:scale-105">
          <img
            src="/images/snapster-logo-white.png"
            alt="SNAPSTER Logo"
            className="h-14 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_4px_30px_rgba(112,4,21,0.8)]"
            onError={(e) => {
              // Fallback to text if image fails
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = document.getElementById('splash-text-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />

          {/* Text fallback */}
          <div id="splash-text-fallback" style={{ display: 'none' }}>
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-white font-['Syne']">
              SNAPSTER
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <h2 className="text-lg sm:text-2xl font-black tracking-[0.2em] uppercase text-white font-['Anton'] mb-2">
          YOUR DAY. YOUR DRIP.
        </h2>

        <p className="text-xs sm:text-sm font-sans text-[#C7BDB7] tracking-wider uppercase max-w-xs sm:max-w-md">
          PREMIUM STREETWEAR & ARCHITECTURAL OVERSIZED ESSENTIALS
        </p>

        {/* Interactive Click Prompt Button */}
        <div className="mt-8 flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md shadow-2xl transition-all duration-200 group">
          <Sparkles size={16} className="text-red-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white">
            Click anywhere to enter SNAPSTER
          </span>
          <ArrowRight size={16} className="text-white transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Bottom auto-shift indicator */}
      <div className="relative z-10 flex flex-col items-center gap-2 w-full max-w-xs text-center">
        <p className="text-[11px] font-mono text-[#C7BDB7]/60 tracking-wider">
          Shifting to Home Page...
        </p>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full"
            style={{
              animation: 'splashProgress 2.2s linear forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splashProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
