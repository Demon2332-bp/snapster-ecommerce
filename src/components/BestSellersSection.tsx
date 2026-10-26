import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const BestSellersSection: React.FC = () => {
  const { setCurrentView, setActiveCategory, products } = useStore();

  const bestSellers = products.filter((p) => p.isBestSeller && !p.isNew).concat(
    products.filter((p) => p.isBestSeller && p.isNew)
  ).slice(0, 6);

  return (
    <section className="w-full bg-[#F6F1E9] text-[#111011] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C7BDB7]/30">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#111011]/15">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#78132D] font-bold flex items-center gap-1.5 mb-1">
              <Flame size={13} className="text-[#78132D]" />
              High Demand Staples
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-headline tracking-wide text-[#111011]">
              BEST SELLERS
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111011]/80 hover:text-[#4A0718] transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 6 Products Grid with Secondary Image Reveal & Smooth Fade-in Add-to-Cart */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} theme="light" />
          ))}
        </div>

      </div>
    </section>
  );
};
