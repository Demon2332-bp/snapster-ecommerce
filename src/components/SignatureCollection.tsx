import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SnapsterLogo } from './SnapsterLogo';

export const SignatureCollection: React.FC = () => {
  const { setCurrentView, setActiveCategory } = useStore();

  const handleExplore = () => {
    setActiveCategory(null);
    setCurrentView('collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#111011] text-[#F6F1E9] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left: Large Immersive Hero Photograph of Seated Model */}
          <div className="lg:col-span-5 relative group overflow-hidden bg-[#1D1B1C] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] border border-white/10 shadow-2xl">
            <img
              src="/images/sig_hero_model.jpg"
              alt="SNAPSTER Signature Collection Model"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            {/* Corner Editorial Stamp */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C7BDB7] bg-black/60 px-2 py-1 backdrop-blur-sm border border-white/10">
                EDITION // 001
              </span>
            </div>
          </div>

          {/* Center: Editorial Manifesto & Typography */}
          <div className="lg:col-span-4 flex flex-col justify-center px-2 lg:px-4 space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7] flex items-center gap-2">
                <span className="w-6 h-[1px] bg-[#4A0718]" />
                Limited Production
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black uppercase font-headline tracking-tight leading-[0.92] text-white">
                THE<br />
                SIGNATURE<br />
                COLLECTION
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#C7BDB7] leading-relaxed font-sans max-w-md">
              Crafted for those who move differently. Heavyweight French Terry, custom Japanese denim, and precision architectural silhouettes designed to outlast fast-fashion cycles.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveCategory('Hoodies');
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-all duration-200 transform hover:translate-x-1 shadow-xl cursor-pointer"
              >
                <span>SHOP SIGNATURE PIECES</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right: Refined Grid of Supporting Campaign Details */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            
            {/* Detail 1: Burgundy Hoodie Detail */}
            <div className="relative group overflow-hidden bg-[#240A10] aspect-[16/10] border border-white/5">
              <img
                src="/images/sig_detail_hoodie.jpg"
                alt="Burgundy hoodie embroidery"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider text-white/90">
                460 GSM Fleece
              </span>
            </div>

            {/* Detail 2: Graphic Tee Back Detail */}
            <div className="relative group overflow-hidden bg-[#1D1B1C] aspect-[16/10] border border-white/5">
              <img
                src="/images/sig_detail_tee_back.jpg"
                alt="Graphic tee back print"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider text-white/90">
                Silkscreen Star Art
              </span>
            </div>

            {/* Detail 3: Brand Statement Graphic Plaque (Mockup Right Side) */}
            <div className="col-span-2 lg:col-span-1 p-5 bg-[#171516] border border-white/10 flex flex-col justify-between aspect-auto lg:aspect-[16/9]">
              <div className="flex items-center justify-between">
                <SnapsterLogo size="sm" variant="light" showElephant={false} />
                <span className="text-[10px] font-mono text-[#C7BDB7]">IND · 2026</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#F6F1E9] mt-3">
                  SNAPSTER — BUILT DIFFERENT.
                </p>
                <div className="w-6 h-[1px] bg-[#4A0718] mt-2" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
