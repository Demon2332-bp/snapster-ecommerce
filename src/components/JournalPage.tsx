import React from 'react';
import { ArrowRight, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const JournalPage: React.FC = () => {
  const { setCurrentView, setActiveCategory, goBack } = useStore();

  const articles = [
    {
      id: 'art-1',
      title: 'The Architecture of Heavyweight Cotton: Why 280 GSM Changes Everything',
      date: 'OCTOBER 2026',
      readTime: '4 MIN READ',
      category: 'FABRIC SCIENCE',
      image: '/images/hero_campaign_model.jpg',
      excerpt: 'Most mass-market t-shirts weigh between 140 to 180 GSM, yielding a flimsy silhouette that collapses against the body. Here is why we strictly calibrate our single-jersey blanks to 280 GSM.',
      ctaCategory: 'T-Shirts',
    },
    {
      id: 'art-2',
      title: 'Brutalist Concrete, Monochromatic Shadows, and Contemporary Proportions',
      date: 'SEPTEMBER 2026',
      readTime: '6 MIN READ',
      category: 'DESIGN THEORY',
      image: '/images/sig_hero_model.jpg',
      excerpt: 'How modern brutalist architecture in Chandigarh and London informs the drop-shoulder seam placement, sleeve tapers, and boxy body dimensions of our Drop 01 campaign.',
      ctaCategory: 'Hoodies',
    },
    {
      id: 'art-3',
      title: 'The Discipline of 14oz Non-Stretch Denim in a World of Elastic Blends',
      date: 'AUGUST 2026',
      readTime: '5 MIN READ',
      category: 'DENIM CRAFT',
      image: '/images/cat_denim.jpg',
      excerpt: 'Elastic fibers break down. Pure 100% ringspun rigid denim softens with wear, shaping to your specific anatomy and recording every fold of daily life.',
      ctaCategory: 'Denim',
    },
  ];

  return (
    <div className="w-full bg-[#111011] text-[#F6F1E9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
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
            HOME &gt; SNAPSTER JOURNAL
          </span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono tracking-widest uppercase text-[#C7BDB7] flex items-center justify-center gap-2">
            <BookOpen size={13} className="text-[#4A0718]" />
            Editorial Essays & Culture
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase font-headline tracking-tight text-white">
            SNAPSTER JOURNAL
          </h1>
          <p className="text-sm sm:text-base text-[#C7BDB7]">
            Explorations in material integrity, architectural aesthetics, and subcultural movements.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-[#171517] border border-white/10 flex flex-col justify-between overflow-hidden group shadow-xl"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#201E20]">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[9px] font-mono uppercase px-2 py-0.5 border border-white/10">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#C7BDB7]">
                    <span>{art.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold uppercase font-headline text-white leading-snug group-hover:text-[#F6F1E9] transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#C7BDB7] leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/5">
                <button
                  onClick={() => {
                    setActiveCategory(art.ctaCategory);
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#C7BDB7] transition-colors cursor-pointer"
                >
                  <span>Explore {art.ctaCategory}</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};
