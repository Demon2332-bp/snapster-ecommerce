import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeCategory, setActiveCategory] = useState<'tops' | 'bottoms'>('tops');

  if (!isSizeGuideOpen) return null;

  const topMeasurements = [
    { size: 'S', chest: unit === 'inches' ? '44"' : '112 cm', length: unit === 'inches' ? '28"' : '71 cm', shoulder: unit === 'inches' ? '21.5"' : '55 cm' },
    { size: 'M', chest: unit === 'inches' ? '46"' : '117 cm', length: unit === 'inches' ? '29"' : '74 cm', shoulder: unit === 'inches' ? '22.5"' : '57 cm' },
    { size: 'L', chest: unit === 'inches' ? '48"' : '122 cm', length: unit === 'inches' ? '30"' : '76 cm', shoulder: unit === 'inches' ? '23.5"' : '60 cm' },
    { size: 'XL', chest: unit === 'inches' ? '50"' : '127 cm', length: unit === 'inches' ? '31"' : '79 cm', shoulder: unit === 'inches' ? '24.5"' : '62 cm' },
    { size: 'XXL', chest: unit === 'inches' ? '52"' : '132 cm', length: unit === 'inches' ? '32"' : '81 cm', shoulder: unit === 'inches' ? '25.5"' : '65 cm' },
  ];

  const bottomMeasurements = [
    { size: 'S', waist: unit === 'inches' ? '30–32"' : '76–81 cm', length: unit === 'inches' ? '40"' : '102 cm', thigh: unit === 'inches' ? '26"' : '66 cm' },
    { size: 'M', waist: unit === 'inches' ? '32–34"' : '81–86 cm', length: unit === 'inches' ? '41"' : '104 cm', thigh: unit === 'inches' ? '27"' : '69 cm' },
    { size: 'L', waist: unit === 'inches' ? '34–36"' : '86–91 cm', length: unit === 'inches' ? '42"' : '107 cm', thigh: unit === 'inches' ? '28"' : '71 cm' },
    { size: 'XL', waist: unit === 'inches' ? '36–38"' : '91–97 cm', length: unit === 'inches' ? '43"' : '109 cm', thigh: unit === 'inches' ? '29"' : '74 cm' },
    { size: 'XXL', waist: unit === 'inches' ? '38–40"' : '97–102 cm', length: unit === 'inches' ? '44"' : '112 cm', thigh: unit === 'inches' ? '30"' : '76 cm' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSizeGuideOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#171617] text-[#F6F1E9] border border-white/15 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#4A0718]">
          <Ruler size={18} />
          <span className="text-xs font-mono uppercase tracking-widest text-white">
            Official Fit Measurement Guide
          </span>
        </div>

        <h3 className="text-2xl font-black uppercase font-headline text-white">
          SNAPSTER SILHOUETTE MATRIX
        </h3>
        <p className="text-xs text-[#C7BDB7] mt-1">
          Our garments are intentionally designed with an oversized drop-shoulder drape. If you prefer a fitted look, consider sizing down one step.
        </p>

        {/* Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCategory('tops')}
              className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                activeCategory === 'tops'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-[#C7BDB7] hover:text-white'
              }`}
            >
              Tees & Hoodies
            </button>
            <button
              onClick={() => setActiveCategory('bottoms')}
              className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                activeCategory === 'bottoms'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-[#C7BDB7] hover:text-white'
              }`}
            >
              Cargos & Denim
            </button>
          </div>

          <div className="flex items-center border border-white/20 text-xs font-mono">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 ${unit === 'inches' ? 'bg-[#4A0718] text-white font-bold' : 'text-[#C7BDB7]'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 ${unit === 'cm' ? 'bg-[#4A0718] text-white font-bold' : 'text-[#C7BDB7]'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-white/5 border-b border-white/15 text-white uppercase text-[11px]">
              <tr>
                <th className="p-2.5">Size</th>
                <th className="p-2.5">{activeCategory === 'tops' ? 'Chest Width' : 'Waist Width'}</th>
                <th className="p-2.5">Length</th>
                <th className="p-2.5">{activeCategory === 'tops' ? 'Shoulder Width' : 'Thigh Width'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#C7BDB7]">
              {(activeCategory === 'tops' ? topMeasurements : bottomMeasurements).map((row) => (
                <tr key={row.size} className="hover:bg-white/5">
                  <td className="p-2.5 font-bold text-white">{row.size}</td>
                  <td className="p-2.5">{(row as any).chest || (row as any).waist}</td>
                  <td className="p-2.5">{row.length}</td>
                  <td className="p-2.5">{(row as any).shoulder || (row as any).thigh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#C7BDB7]">
          <span>Need custom sizing consultation?</span>
          <span className="text-white underline cursor-pointer">Live Sizing Help</span>
        </div>
      </div>
    </div>
  );
};
