import React from 'react';
import { X, Tag, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromoOffersModal: React.FC = () => {
  const { isOffersOpen, setIsOffersOpen, applyPromoCode, showToast } = useStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  if (!isOffersOpen) return null;

  const offers = [
    {
      code: 'EDGE20',
      discount: '20% OFF',
      title: 'First Drop Welcome Privilege',
      minSpend: 'No minimum cart requirement',
      validity: 'Limited to the first 500 orders',
    },
    {
      code: 'SNAP10',
      discount: '10% OFF',
      title: 'VIP Community Member Reward',
      minSpend: 'Valid on entire architectural archive',
      validity: 'Instant activation',
    },
    {
      code: 'FREESHIP',
      discount: 'FREE SHIPPING',
      title: 'Zero Delivery Fee Pass',
      minSpend: 'Applies to any cart size across India',
      validity: 'Available this weekend',
    },
  ];

  const handleCopyAndApply = (code: string) => {
    applyPromoCode(code);
    setCopiedCode(code);
    navigator.clipboard?.writeText(code);
    setTimeout(() => {
      setCopiedCode(null);
      setIsOffersOpen(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setIsOffersOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#171617] text-[#F6F1E9] border border-white/15 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOffersOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#4A0718]">
          <Tag size={18} />
          <span className="text-xs font-mono uppercase tracking-widest text-white">
            Exclusive Collector Codes
          </span>
        </div>

        <h3 className="text-2xl font-black uppercase font-headline text-white mb-4">
          AVAILABLE PROMOTIONS
        </h3>

        <div className="space-y-3">
          {offers.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.code}
                className="p-4 bg-white/5 border border-dashed border-white/20 hover:border-white/40 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-mono text-emerald-400">
                      {offer.discount}
                    </span>
                    <span className="bg-[#4A0718] text-white text-[10px] font-mono px-2 py-0.5 font-bold">
                      {offer.code}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{offer.title}</h4>
                  <p className="text-[10px] text-[#C7BDB7] mt-0.5 font-mono">{offer.minSpend}</p>
                </div>

                <button
                  onClick={() => handleCopyAndApply(offer.code)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                    isCopied
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white text-black hover:bg-[#F6F1E9]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check size={12} />
                      <span>APPLIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>APPLY</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-center text-[11px] font-mono text-[#C7BDB7]">
          Discounts automatically calculate at bag checkout.
        </div>
      </div>
    </div>
  );
};
