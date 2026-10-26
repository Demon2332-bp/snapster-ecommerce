import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, UserCheck, HelpCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeFitHelperModal: React.FC = () => {
  const {
    isSizeFitHelperOpen,
    setIsSizeFitHelperOpen,
    quickViewProduct,
    setRecommendedSize,
    showToast,
  } = useStore();

  const [heightCm, setHeightCm] = useState(178); // ~5'10"
  const [weightKg, setWeightKg] = useState(74);
  const [fitPreference, setFitPreference] = useState<'standard' | 'baggy' | 'fitted'>('standard');
  const [bodyType, setBodyType] = useState<'lean' | 'athletic' | 'broad'>('athletic');

  if (!isSizeFitHelperOpen) return null;

  // Algorithm for oversized streetwear sizing
  const calculateSize = (): 'S' | 'M' | 'L' | 'XL' | 'XXL' => {
    let score = (heightCm - 160) * 0.4 + (weightKg - 50) * 0.6;
    
    if (bodyType === 'broad') score += 5;
    if (bodyType === 'lean') score -= 4;

    if (fitPreference === 'baggy') score += 7;
    if (fitPreference === 'fitted') score -= 7;

    if (score < 20) return 'S';
    if (score < 34) return 'M';
    if (score < 48) return 'L';
    if (score < 60) return 'XL';
    return 'XXL';
  };

  const recommended = calculateSize();

  const handleApplySize = () => {
    setRecommendedSize(recommended);
    setIsSizeFitHelperOpen(false);
    showToast(`Size ${recommended} applied based on your silhouette profile!`, 'success');
  };

  const heightFeetInches = () => {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={() => setIsSizeFitHelperOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#171617] text-[#F6F1E9] border border-white/15 shadow-2xl overflow-hidden my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsSizeFitHelperOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white cursor-pointer"
          aria-label="Close fit helper"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1 text-[#4A0718]">
          <Sparkles size={16} />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C7BDB7]">
            Architectural Fit Engine
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase font-headline tracking-wide text-white">
          OVERSIZED SILHOUETTE RECOMMENDER
        </h2>
        <p className="text-xs text-[#C7BDB7] mt-1 max-w-lg">
          SNAPSTER silhouettes feature deliberate dropped shoulders, wider chests, and heavy drape. Calibrate your precise fit below:
        </p>

        {/* Sliders & Selectors */}
        <div className="mt-6 space-y-5">
          
          {/* Height Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#C7BDB7] uppercase">Your Height</span>
              <span className="text-white font-bold">{heightCm} cm ({heightFeetInches()})</span>
            </div>
            <input
              type="range"
              min={155}
              max={205}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-[#4A0718] bg-white/10 h-1.5 rounded-full cursor-pointer"
            />
          </div>

          {/* Weight Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#C7BDB7] uppercase">Your Weight</span>
              <span className="text-white font-bold">{weightKg} kg ({Math.round(weightKg * 2.204)} lbs)</span>
            </div>
            <input
              type="range"
              min={50}
              max={115}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#4A0718] bg-white/10 h-1.5 rounded-full cursor-pointer"
            />
          </div>

          {/* Body Build */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-[#C7BDB7] uppercase block">
              Body Frame
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lean', label: 'Lean / Slim' },
                { id: 'athletic', label: 'Athletic / Regular' },
                { id: 'broad', label: 'Broad / Heavy' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBodyType(b.id as any)}
                  className={`py-2 px-3 text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                    bodyType === b.id
                      ? 'bg-white text-[#111011] border-white'
                      : 'bg-white/5 border-white/10 text-[#C7BDB7] hover:border-white/30'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Preference */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-[#C7BDB7] uppercase block">
              Desired Streetwear Drape
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fitted', label: 'Tailored / Fitted', desc: 'True to standard sizing' },
                { id: 'standard', label: 'Signature Oversized', desc: 'As shown on model' },
                { id: 'baggy', label: 'Extreme Baggy', desc: 'Skater boxy drape' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFitPreference(f.id as any)}
                  className={`p-2.5 text-left border transition-colors cursor-pointer ${
                    fitPreference === f.id
                      ? 'bg-[#4A0718] border-[#78132D] text-white'
                      : 'bg-white/5 border-white/10 text-[#C7BDB7] hover:border-white/30'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{f.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Calculation Result Callout */}
        <div className="mt-6 p-4 bg-[#201D20] border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#4A0718] text-white flex items-center justify-center font-black font-headline text-3xl shrink-0 shadow-lg border border-white/10">
              {recommended}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                <Check size={12} />
                Calculated Optimal Fit
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                Size {recommended} Recommended for {quickViewProduct?.name || 'this piece'}
              </h4>
              <p className="text-[11px] font-mono text-[#C7BDB7] mt-0.5">
                Model Reference: 6'1" (185 cm), 78 kg wears Size L with a relaxed boxy drape.
              </p>
            </div>
          </div>

          <button
            onClick={handleApplySize}
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer shrink-0 shadow-xl flex items-center justify-center gap-1.5"
          >
            <span>APPLY SIZE {recommended}</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
