import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export const CategorySection: React.FC = () => {
  const { setActiveCategory, setCurrentView } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#111011] text-[#F6F1E9] py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7] block mb-1">
              Curated Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-headline tracking-wide text-white">
              SHOP BY CATEGORY
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C7BDB7] hover:text-white transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 6 Category Panels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group relative cursor-pointer overflow-hidden bg-[#1D1B1C] aspect-[3/4] flex flex-col justify-end p-4 transition-all duration-300"
            >
              {/* Background Image with Hover Scale */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111011] via-[#111011]/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Category Info */}
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-black uppercase font-headline tracking-wider text-white">
                  {cat.name}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#C7BDB7] group-hover:text-white transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </div>

              {/* Subtle top subtle border glow */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white/0 group-hover:bg-[#4A0718] transition-colors" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
