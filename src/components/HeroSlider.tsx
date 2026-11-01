import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CAMPAIGN_SLIDES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { SnapsterLogo } from './SnapsterLogo';

export const HeroSlider: React.FC = () => {
  const { setCurrentView, setActiveCategory, setIsOrderTrackingOpen } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = CAMPAIGN_SLIDES.length;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const activeData = CAMPAIGN_SLIDES[currentSlide];

  const handleCtaClick = () => {
    if (currentSlide === 0) {
      setCurrentView('shop');
      window.scrollTo({ top: 750, behavior: 'smooth' });
    } else if (currentSlide === 2) {
      setActiveCategory('Hoodies');
      setCurrentView('shop');
    } else if (currentSlide === 3) {
      setActiveCategory('Denim');
      setCurrentView('shop');
    } else {
      setCurrentView('shop');
    }
  };

  return (
    <section
      className="relative w-full bg-[#111011] text-[#F6F1E9] overflow-hidden select-none focus:outline-none min-h-[540px] sm:min-h-[620px] lg:min-h-[690px] flex items-stretch border-b border-white/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-label="SNAPSTER Campaign Carousel"
    >
      {/* Vertical Brand Side Strip (Mockup Editorial Touch) */}
      <div className="hidden lg:flex w-12 xl:w-14 shrink-0 bg-[#0E0D0E] border-r border-white/5 flex-col justify-between items-center py-8 z-20">
        <div className="text-[10px] font-mono tracking-widest text-[#C7BDB7]/70 rotate-[-90deg] whitespace-nowrap origin-center mt-20">
          STREETWEAR  /  ESSENTIALS  /  FOR A BOLDER TOMORROW.
        </div>
        <div className="w-[1px] h-16 bg-white/10 my-4" />
        <div className="text-[10px] font-mono tracking-widest text-[#C7BDB7]/50 rotate-[-90deg] whitespace-nowrap origin-center mb-12">
          AUTUMN WINTER 2026
        </div>
      </div>

      {/* Main Campaign Slide Viewport */}
      <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
        {/* Background Images for all slides with crossfade */}
        {CAMPAIGN_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.headline.replace('\n', ' ')}
                className={`w-full h-full object-cover object-top md:object-center transform scale-100 transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
              />

              {/* Sophisticated Dark Burgundy & Charcoal Architectural Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#111011]/95 via-[#111011]/75 to-[#111011]/10 lg:w-[72%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111011] via-transparent to-[#111011]/50" />
              <div className="absolute inset-0 bg-[#4A0718]/15 mix-blend-multiply" />
            </div>
          );
        })}

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-10 lg:px-14 pt-10 md:pt-14 pb-16 flex-1 flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Slide-specific Logo Mark & Subtitle Tag */}
            <div className="mb-4 sm:mb-6 flex items-center gap-3 animate-fade-in">
              <SnapsterLogo size="sm" variant="light" />
            </div>

            {/* Huge Bold Condensed Campaign Headline */}
            <h1 className="text-[clamp(3.25rem,9vw,8.5rem)] sm:text-7xl md:text-8xl xl:text-9xl font-black uppercase leading-[0.88] tracking-tight font-headline text-white drop-shadow-sm">
              {activeData.headline.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {/* Supporting Brand Statement */}
            <p className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg font-bold tracking-widest text-[#F6F1E9] uppercase font-sans">
              {activeData.statement}
            </p>

            {/* Action CTA Buttons */}
            <div className="mt-6 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleCtaClick}
                className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 bg-white text-[#111011] hover:bg-[#F6F1E9] font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 transform hover:translate-x-1 shadow-2xl cursor-pointer"
              >
                <span>{activeData.ctaText}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1.5"
                />
              </button>

              <button
                onClick={() => {
                  setCurrentView('collections');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 sm:py-4 border border-white/30 text-white hover:border-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 backdrop-blur-sm cursor-pointer hover:bg-white/10"
              >
                <span>EXPLORE LOOKBOOK</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Slide Indicators and Carousel Controls (Desktop & Mobile) */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 pb-8 flex items-center justify-between">
          
          {/* Subtle Horizontal Dash Indicators */}
          <div className="flex items-center gap-2.5">
            {CAMPAIGN_SLIDES.map((_, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-[3px] transition-all duration-300 rounded-full cursor-pointer ${
                    isActive ? 'w-8 sm:w-10 bg-white' : 'w-4 sm:w-5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Previous / Next Arrow Controls in Bottom Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
