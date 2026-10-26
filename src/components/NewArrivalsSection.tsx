import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { setCurrentView, setActiveCategory, products } = useStore();

  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  return (
    <section className="w-full bg-[#4A0718] text-[#F6F1E9] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#650D24]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/15">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/70 flex items-center gap-1.5 mb-1">
              <Sparkles size={12} className="text-white" />
              Drop 01 // Autumn Winter 2026
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-headline tracking-wide text-white">
              NEW ARRIVALS
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 6 Products Grid with Secondary Image Hover & Smooth Add-to-Cart */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {newArrivals.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} theme="burgundy" />
          ))}
        </div>

      </div>
    </section>
  );
};
