import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check, Zap, Truck, Edit3 } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  theme?: 'burgundy' | 'light' | 'dark';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  theme = 'dark',
}) => {
  const {
    toggleWishlist,
    isWishlisted,
    addToCart,
    triggerBuyNow,
    setQuickViewProduct,
    formatPrice,
    addRecentlyViewed,
    getExpectedDeliveryDate,
    isAdmin,
    openAdminEditProduct,
  } = useStore();

  const isFav = isWishlisted(product.id);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const deliveryDate = getExpectedDeliveryDate();

  const handleQuickAdd = (
    e: React.MouseEvent,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  ) => {
    e.stopPropagation();
    const success = addToCart(product, size, currentColor.name, 1);
    if (success) {
      setJustAdded(true);
      setShowQuickSizes(false);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerBuyNow(product, product.sizes[0], currentColor.name, 1);
  };

  const handleCardClick = () => {
    addRecentlyViewed(product.id);
    setQuickViewProduct(product);
  };

  // Theme styling tokens
  const containerClasses =
    theme === 'burgundy'
      ? 'bg-[#3B0512]/60 hover:bg-[#3B0512] border-white/10 hover:border-white/25 text-white'
      : theme === 'light'
      ? 'bg-white hover:bg-white border-[#111011]/10 hover:border-[#111011]/30 text-[#111011] shadow-sm hover:shadow-xl'
      : 'bg-[#181618] hover:bg-[#1E1C1E] border-white/10 hover:border-white/30 text-white';

  const imageBg =
    theme === 'burgundy'
      ? 'bg-[#2A040D]'
      : theme === 'light'
      ? 'bg-[#EFEAE2]'
      : 'bg-[#201E20]';

  const titleColor =
    theme === 'light'
      ? 'text-[#111011] group-hover:text-[#4A0718]'
      : 'text-white group-hover:text-[#F6F1E9]';

  const priceColor =
    theme === 'light' ? 'text-[#111011]' : 'text-white';

  const strikeColor =
    theme === 'light' ? 'text-[#111011]/45' : 'text-white/50';

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col cursor-pointer border transition-all duration-300 ${containerClasses}`}
      role="article"
      aria-label={product.name}
    >
      {/* Product Image Frame with Dual-Image Smooth Hover Transition */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden ${imageBg}`}>
        {/* Primary Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            product.secondaryImage
              ? 'group-hover:scale-108 group-hover:opacity-0'
              : 'group-hover:scale-105'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Secondary Image: Gracefully fades and zooms in on card hover */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 scale-95 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Badge: NEW or BEST SELLER */}
        {product.isNew ? (
          <span className="absolute top-2.5 left-2.5 bg-[#4A0718] text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 tracking-wider shadow-md">
            NEW
          </span>
        ) : product.isBestSeller ? (
          <span className="absolute top-2.5 left-2.5 bg-[#111011] text-[#F6F1E9] text-[9px] font-mono font-black uppercase px-2 py-0.5 tracking-wider shadow-md">
            BESTSELLER
          </span>
        ) : null}

        {/* Admin Quick-Edit Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAdminEditProduct(product);
            }}
            className="absolute top-2.5 right-11 p-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg transition-transform hover:scale-110 active:scale-90 z-20"
            title="Admin: Edit Pictures, Cost & Discount"
            aria-label="Edit product pictures and cost"
          >
            <Edit3 size={13} strokeWidth={2.5} />
          </button>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-80 duration-200 z-20 ${
            theme === 'light'
              ? 'bg-white/90 hover:bg-white text-[#111011] shadow-md'
              : 'bg-black/50 hover:bg-black/80 text-white'
          }`}
          aria-label={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={14}
            className={
              isFav
                ? theme === 'light'
                  ? 'fill-[#4A0718] text-[#4A0718]'
                  : 'fill-white text-white'
                : 'text-current'
            }
          />
        </button>

        {/* View Details Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="absolute top-10 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0 z-20"
          title="Quick View"
          aria-label="Quick View"
        >
          <Eye size={13} />
        </button>

        {/* Flipkart-Style Action Overlay: 'ADD TO BAG' + 'BUY NOW' (Smooth Fade-in on hover, accessible on mobile) */}
        <div className="absolute inset-x-2 bottom-2 z-20 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-300 ease-out">
          {showQuickSizes ? (
            /* Quick Size Selector Panel */
            <div
              className="bg-[#111011] p-2.5 border border-white/20 shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#C7BDB7] mb-1.5">
                <span>Select Size to Add:</span>
                <button
                  onClick={() => setShowQuickSizes(false)}
                  className="text-white hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickAdd(e, sz)}
                    className="py-1 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Dual Flipkart-Style Action Buttons */
            <div className="grid grid-cols-2 gap-1.5 shadow-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.sizes.length === 1) {
                    handleQuickAdd(e, product.sizes[0]);
                  } else {
                    setShowQuickSizes(true);
                  }
                }}
                className={`py-2 px-1 font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#111011] text-white hover:bg-black'
                    : 'bg-white text-[#111011] hover:bg-[#F6F1E9]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span>ADDED</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={11} />
                    <span>ADD</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNowClick}
                className="py-2 px-1 bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
              >
                <Zap size={11} className="fill-black" />
                <span>BUY NOW</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Typography & Color Swatches */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtle Category & Fabric GSM Tag */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase opacity-70 mb-1">
            <span>{product.category}</span>
            <span>{product.gsm} GSM</span>
          </div>

          {/* Product Name */}
          <h3 className={`text-xs sm:text-[13px] font-bold line-clamp-1 transition-colors ${titleColor}`}>
            {product.name}
          </h3>

          {/* Price with Multi-Currency Support & Discount Tag */}
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5 font-mono">
            <span className={`text-xs sm:text-sm font-bold ${priceColor}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className={`text-[11px] line-through ${strikeColor}`}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded-xs border border-emerald-800/60">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Flipkart Style Rating & Delivery Date Callout */}
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Truck size={11} className="shrink-0" />
              <span>By <strong className="text-white underline">{deliveryDate}</strong></span>
              <span className="text-[9px] font-bold text-white bg-emerald-950/80 px-1 border border-emerald-600/40">Assured</span>
            </div>
            {product.rating && (
              <div className="flex items-center gap-0.5 text-amber-400 bg-amber-950/40 px-1 py-0.2 border border-amber-800/40">
                <span>★</span>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-[#C7BDB7] text-[9px]">({product.reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="mt-2.5 pt-2 border-t border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-transform cursor-pointer ${
                  selectedColorIdx === idx
                    ? 'ring-1 ring-current scale-125'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono opacity-60 truncate max-w-[90px]">
            {currentColor.name}
          </span>
        </div>
      </div>
    </div>
  );
};
