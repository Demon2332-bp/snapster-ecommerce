import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    products,
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    addToCart,
    setCurrentView,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsWishlistOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#141314] text-[#F6F1E9] h-full shadow-2xl flex flex-col justify-between border-l border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#1C1A1C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} className="fill-[#4A0718] text-[#4A0718]" />
            <h3 className="text-base font-black uppercase font-headline tracking-wider text-white">
              SAVED PIECES ({wishlistProducts.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1 text-white hover:opacity-75 transition-opacity"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C7BDB7]">
                <Heart size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase font-headline text-white">
                  YOUR WISHLIST IS EMPTY
                </h4>
                <p className="text-xs text-[#C7BDB7] mt-1 max-w-xs">
                  Save your favorite silhouettes and grab them when new sizes drop.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setCurrentView('shop');
                }}
                className="px-6 py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
              >
                DISCOVER STREETWEAR
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors cursor-pointer"
                onClick={() => {
                  setQuickViewProduct(product);
                  setIsWishlistOpen(false);
                }}
              >
                <div className="w-20 h-24 bg-[#1D1B1C] shrink-0 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="text-[#C7BDB7] hover:text-red-400 transition-colors p-0.5"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-[#C7BDB7] mt-0.5">{product.category}</p>
                    <p className="text-xs font-mono font-bold text-white mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, product.sizes[0], product.colors[0].name, 1);
                        toggleWishlist(product.id);
                      }}
                      className="w-full py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag size={11} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 bg-[#0F0E0F] border-t border-white/10">
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => {
                  addToCart(p, p.sizes[0], p.colors[0].name, 1);
                });
                setIsWishlistOpen(false);
              }}
              className="w-full py-3.5 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
            >
              MOVE ALL TO BAG
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
