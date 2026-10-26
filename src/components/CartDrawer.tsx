import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, Truck, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    appliedPromo,
    applyPromoCode,
    freeShippingThreshold,
    setIsCheckoutOpen,
    setCurrentView,
    formatPrice,
    setIsOffersOpen,
    getExpectedDeliveryDate,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const total = cartSubtotal - discountAmount + shippingFee;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#141314] text-[#F6F1E9] h-full shadow-2xl flex flex-col justify-between border-l border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#4A0718] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-white" />
            <h3 className="text-base font-black uppercase font-headline tracking-wider text-white">
              YOUR SHOPPING BAG ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-white hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#1C1A1C] p-3.5 border-b border-white/5 text-xs font-mono">
          {amountToFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[#C7BDB7]">
                <span>
                  Add <strong className="text-white">{formatPrice(amountToFreeShipping)}</strong> more for:
                </span>
                <span className="text-emerald-400 font-bold">FREE SHIPPING</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#4A0718] h-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>UNLOCKED: Free Express Shipping across India</span>
            </p>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C7BDB7]">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase font-headline text-white">
                  YOUR BAG IS EMPTY
                </h4>
                <p className="text-xs text-[#C7BDB7] mt-1 max-w-xs">
                  Explore our latest campaign drop and build your architectural wardrobe.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('shop');
                }}
                className="px-6 py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-[#1D1B1C] shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#C7BDB7] hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-[#C7BDB7]">
                      <span>Size: <strong className="text-white">{item.size}</strong></span>
                      <span>·</span>
                      <span className="truncate">{item.color}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <Truck size={10} />
                      <span>Delivery by <strong>{getExpectedDeliveryDate()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    {/* Stepper */}
                    <div className="flex items-center border border-white/20 bg-white/5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-white hover:bg-white/10 text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-white hover:bg-white/10 text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-mono text-xs font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#0F0E0F] border-t border-white/10 space-y-4">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-2.5 text-[#C7BDB7]" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (e.g. EDGE20)"
                  className="w-full bg-white/5 border border-white/15 pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-[#C7BDB7]/50 uppercase focus:outline-none focus:border-white"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <button
                onClick={() => setIsOffersOpen(true)}
                className="text-[#C7BDB7] hover:text-white underline cursor-pointer"
              >
                View Available Offers
              </button>
              {appliedPromo && (
                <span className="text-emerald-400 font-bold">
                  Code {appliedPromo} Applied (-{formatPrice(discountAmount)})
                </span>
              )}
            </div>

            {/* Subtotal & Breakdown */}
            <div className="space-y-1.5 text-xs font-mono text-[#C7BDB7] pt-2 border-t border-white/5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Grand Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Dual Flipkart-Style Checkout Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-2xl cursor-pointer"
              >
                <Zap size={15} className="fill-black" />
                <span>BUY NOW (EXPRESS CHECKOUT)</span>
              </button>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
              >
                <span>PROCEED TO STANDARD CHECKOUT</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Flipkart-Style Payment Assurance Badges */}
            <div className="pt-2 border-t border-white/10 text-center space-y-1.5 text-[10px] font-mono text-[#C7BDB7]">
              <div className="flex items-center justify-center gap-2 text-white/80">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>100% Safe Payments · Verified SSL Checkout</span>
              </div>
              <p className="opacity-75">
                UPI (GPay / PhonePe) · Credit & Debit Cards · Net Banking · COD Available
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
