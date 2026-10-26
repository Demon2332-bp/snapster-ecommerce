import React from 'react';
import { Truck, ShieldCheck, Lock, RotateCcw } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'VIJAYAWADA & AP EXPRESS',
      subtitle: 'Fast dispatch from Vijayawada Central Hub',
    },
    {
      icon: ShieldCheck,
      title: 'SNAPSTER ASSURED',
      subtitle: '100% Original Heavyweight Streetwear',
    },
    {
      icon: Lock,
      title: 'CASH ON DELIVERY & UPI',
      subtitle: 'Doorstep COD across Andhra Pradesh',
    },
    {
      icon: RotateCcw,
      title: '7-DAY REPLACEMENT',
      subtitle: 'Hassle-Free Doorstep Size Exchange',
    },
  ];

  return (
    <section className="w-full bg-[#4A0718] text-[#F6F1E9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-[#650D24]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-none border border-white/20 bg-white/5 flex items-center justify-center shrink-0 text-white group-hover:bg-white group-hover:text-[#4A0718] transition-colors duration-200">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-white font-headline">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/70 tracking-wide mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
