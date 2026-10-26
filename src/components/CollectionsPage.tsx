import React from 'react';
import { ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CollectionsPage: React.FC = () => {
  const { setCurrentView, setActiveCategory, goBack } = useStore();

  const collections = [
    {
      id: 'col-1',
      title: 'DROP 01 // YOUR DAY. YOUR DRIP.',
      tagline: 'Autumn Winter 2026 Campaign',
      description: 'Oversized silhouettes in deep oxblood, concrete grey, and washed pitch black. Engineered for presence and drape.',
      image: '/images/hero_campaign_model.jpg',
      category: 'T-Shirts',
      pieces: '6 Silhouettes Released',
    },
    {
      id: 'col-2',
      title: 'DROP 02 // THE SIGNATURE COLLECTION',
      tagline: 'Heavyweight Fleece & French Terry',
      description: '460 GSM double-hooded pullovers and ribbed gusset sweatpants designed without seasonal compromise.',
      image: '/images/sig_hero_model.jpg',
      category: 'Hoodies',
      pieces: 'Limited Run: 300 Units',
    },
    {
      id: 'col-3',
      title: 'DROP 03 // TACTICAL ARCHITECTURE',
      tagline: 'Ripstop Utility & Cargo Series',
      description: 'Multi-pocket trousers and structured overshirts built with reinforced stress points and custom metal hardware.',
      image: '/images/prod_urban_cargos.jpg',
      category: 'Cargos',
      pieces: '8 Pocket Configurations',
    },
    {
      id: 'col-4',
      title: 'DROP 04 // VINTAGE RIGID DENIM',
      tagline: '14oz Authentic Non-Stretch Denim',
      description: 'Hand-distressed trucker jackets and straight skater jeans that mold to your movement with time.',
      image: '/images/prod_denim_jacket.jpg',
      category: 'Denim',
      pieces: 'Antique Silver Hardware',
    },
  ];

  const handleShopCollection = (cat: string) => {
    setActiveCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#111011] text-[#F6F1E9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* Navigation Breadcrumb & Back Arrow */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-[#F6F1E9] hover:text-white rounded border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group"
            title="Return to previous / main page"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Main Page</span>
          </button>

          <span className="hidden sm:inline-block text-[11px] font-mono text-[#C7BDB7]">
            HOME &gt; COLLECTIONS ARCHIVE
          </span>
        </div>

        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono tracking-widest uppercase text-[#C7BDB7] flex items-center justify-center gap-2">
            <Sparkles size={13} className="text-[#4A0718]" />
            Archival Drops & Lookbooks
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase font-headline tracking-tight text-white">
            SNAPSTER COLLECTIONS
          </h1>
          <p className="text-sm sm:text-base text-[#C7BDB7] font-sans">
            Every collection is developed in strictly limited runs. When an edition sells out, it is retired to our archive.
          </p>
        </div>

        {/* Collection Editorial List */}
        <div className="space-y-16">
          {collections.map((col, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={col.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#161516] border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`lg:col-span-7 relative group overflow-hidden bg-[#201E20] aspect-[16/10] border border-white/10 ${
                    !isEven ? 'lg:order-2' : ''
                  }`}
                >
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
                  <span className="absolute bottom-4 left-4 text-[10px] font-mono text-white bg-black/60 px-2 py-1 backdrop-blur-sm border border-white/15">
                    {col.pieces}
                  </span>
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-5 space-y-4 ${
                    !isEven ? 'lg:order-1' : ''
                  }`}
                >
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#78132D] font-bold block">
                    {col.tagline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-headline text-white tracking-wide">
                    {col.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#C7BDB7] leading-relaxed">
                    {col.description}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleShopCollection(col.category)}
                      className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                    >
                      <span>SHOP THIS DROP</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
