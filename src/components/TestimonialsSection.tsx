import React from 'react';
import { Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F6F1E9] text-[#111011] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C7BDB7]/30">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#111011]/15">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#78132D] font-bold block mb-1">
              Community Sentiment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase font-headline tracking-wide text-[#111011]">
              WHAT OUR CUSTOMERS SAY
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111011]/80">
            <span>Verified Drops</span>
            <CheckCircle2 size={14} className="text-[#4A0718]" />
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 sm:p-7 border border-[#111011]/10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#111011] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#111011] text-[#111011]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-[#111011] italic">
                  "{t.review}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="mt-6 pt-4 border-t border-[#111011]/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111011]">
                    — {t.author}
                  </h4>
                  <span className="text-[11px] text-[#111011]/60 font-mono">
                    {t.city} · Verified Buyer
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#78132D] uppercase font-bold tracking-wider">
                  5.0 ★
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
