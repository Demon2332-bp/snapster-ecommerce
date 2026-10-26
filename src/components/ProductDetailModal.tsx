import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, MapPin, Share2, Ruler, Star, Sparkles, Zap, ChevronRight, Tag, Edit3 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    showToast,
    formatPrice,
    setIsSizeGuideOpen,
    setIsSizeFitHelperOpen,
    recommendedSize,
    triggerBuyNow,
    getExpectedDeliveryDate,
    isAdmin,
    openAdminEditProduct,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('520001');
  const [pinStatus, setPinStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'measurements' | 'reviews'>('specs');

  // Auto-apply recommended size if available
  useEffect(() => {
    if (recommendedSize) {
      setSelectedSize(recommendedSize);
    }
  }, [recommendedSize]);

  // Reset image and state when product changes
  useEffect(() => {
    setActiveImageIdx(0);
    setPinStatus(null);
    if (recommendedSize) {
      setSelectedSize(recommendedSize);
    } else {
      setSelectedSize(null);
    }
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFav = isWishlisted(product.id);
  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const deliveryDate = getExpectedDeliveryDate(pincode);

  // Build full gallery array with fallbacks
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : product.secondaryImage
    ? [product.image, product.secondaryImage]
    : [product.image];

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select your size (S, M, L, XL, XXL) or use our Fit Helper', 'error');
      return;
    }
    const success = addToCart(product, selectedSize, currentColor.name, quantity);
    if (success) {
      setQuickViewProduct(null);
    }
  };

  const handleBuyNow = () => {
    const sizeToUse = selectedSize || product.sizes[0];
    const success = triggerBuyNow(product, sizeToUse, currentColor.name, quantity);
    if (success) {
      setQuickViewProduct(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'success');
  };

  const checkPinDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length === 6) {
      if (cleanPin.startsWith('520')) {
        setPinStatus(`⚡ Vijayawada Priority: FREE Express Delivery by ${deliveryDate}. Cash on Delivery Available.`);
      } else if (cleanPin.startsWith('51') || cleanPin.startsWith('52') || cleanPin.startsWith('53')) {
        setPinStatus(`Andhra Pradesh Hub: Delivery by ${deliveryDate}. Free Cash on Delivery Available.`);
      } else {
        setPinStatus(`All-India Delivery: Guaranteed by ${deliveryDate} via BlueDart Air.`);
      }
    } else {
      setPinStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={() => setQuickViewProduct(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl bg-[#171617] text-[#F6F1E9] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Left: Interactive Multi-Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col justify-between bg-[#1D1B1C] border-b md:border-b-0 md:border-r border-white/10">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#242224]">
            <img
              src={gallery[activeImageIdx] || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-[#4A0718] text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 tracking-wider border border-white/20">
                LIMITED DROP
              </span>
            )}

            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono uppercase px-2 py-1 border border-white/10">
                {product.gsm} GSM
              </span>
              <span className="bg-black/75 backdrop-blur-sm text-[#C7BDB7] text-[10px] font-mono uppercase px-2 py-1 border border-white/10">
                {product.fit}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {gallery.length > 1 && (
            <div className="p-3 bg-[#141314] flex items-center gap-2 overflow-x-auto border-t border-white/5">
              {gallery.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-18 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-white scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details, Size Selector, Tabs, & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] md:max-h-[640px] flex flex-col justify-between space-y-6">
          <div>
            {/* Header / Category & Share */}
            <div className="flex items-center justify-between text-xs font-mono text-[#C7BDB7] mb-2">
              <span className="uppercase tracking-widest">{product.category} // ARCHIVE</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="Share Piece"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
                <span>★ {product.rating} ({product.reviewCount})</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-headline tracking-wide text-white leading-tight">
              {product.name}
            </h2>

            {/* Price with Currency support */}
            <div className="mt-2.5 flex items-baseline gap-3 font-mono">
              <span className="text-2xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#C7BDB7] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                  SAVE {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3B0512] border border-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>SNAPSTER Assured</span>
              </span>
            </div>

            {/* Flipkart Style Delivery ETA Banner */}
            <div className="mt-3.5 p-2.5 bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Truck size={15} className="shrink-0" />
                <span>
                  Delivery by <strong className="text-white underline">{deliveryDate}</strong> | <strong className="text-emerald-400 font-bold">FREE</strong>
                </span>
              </div>
              <span className="text-[10px] text-[#C7BDB7] font-mono">PIN: {pincode}</span>
            </div>

            {/* Flipkart Style Available Offers Section */}
            <div className="mt-3 p-3 bg-white/[0.03] border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-1.5 text-white font-bold text-[11px] uppercase tracking-wider">
                <Tag size={13} className="text-amber-400" />
                <span>Available Offers</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#C7BDB7]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Bank Offer:</strong> 10% instant discount on Axis & ICICI Bank Cards (up to ₹500).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Special Price:</strong> Extra 20% off with coupon code <strong className="text-white underline">EDGE20</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Assurance:</strong> 7 Days Easy Replacement & Doorstep Cash on Delivery.</span>
                </li>
              </ul>
            </div>

            {/* Color Swatches */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F6F1E9] mb-2">
                <span>Colorway:</span>
                <span className="text-[#C7BDB7] font-mono">{currentColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'border-white scale-110 shadow-md'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector with Integrated Sophisticated Fit Helper */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F6F1E9] mb-2">
                <span>Select Size:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSizeFitHelperOpen(true)}
                    className="text-[11px] font-mono text-emerald-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Sparkles size={12} />
                    <span>Fit Finder</span>
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] font-mono text-[#C7BDB7] hover:text-white flex items-center gap-1 cursor-pointer underline"
                  >
                    <Ruler size={12} />
                    <span>Size Chart</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  const isRecommended = recommendedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`relative py-2.5 text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#111011] shadow-xl font-black'
                          : 'bg-white/5 border border-white/15 text-white hover:bg-white/15'
                      }`}
                    >
                      {sz}
                      {isRecommended && (
                        <span className="absolute -top-1.5 -right-1 bg-emerald-500 text-black text-[8px] font-black px-1 rounded-sm">
                          FIT
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {recommendedSize && (
                <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                  <span>✓ Recommended Size: {recommendedSize} for your profile</span>
                  <button
                    onClick={() => setIsSizeFitHelperOpen(true)}
                    className="underline text-[#C7BDB7] hover:text-white"
                  >
                    Recalibrate
                  </button>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Stock */}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center border border-white/20 bg-white/5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Check size={12} />
                <span>{product.stock} items remaining in this drop</span>
              </div>
            </div>

            {/* Flipkart-Style Action Buttons: ADD TO CART & BUY NOW */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs sm:text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xl active:scale-[0.99]"
              >
                <ShoppingBag size={15} />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xl active:scale-[0.99]"
              >
                <Zap size={15} className="fill-black" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Admin Direct Edit Action */}
            {isAdmin && (
              <button
                onClick={() => openAdminEditProduct(product)}
                className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Edit3 size={14} />
                <span>Admin: Edit Pictures, Cost & Discount for This Piece</span>
              </button>
            )}

            {/* Indian Pincode Delivery Form */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <form onSubmit={checkPinDelivery} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={14} className="absolute left-3 top-3 text-[#C7BDB7]" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Indian PIN code"
                    className="w-full bg-white/5 border border-white/15 pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-[#C7BDB7]/50 focus:outline-none focus:border-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase font-mono tracking-wider transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pinStatus && (
                <p className="mt-1.5 text-[11px] font-mono text-emerald-400">{pinStatus}</p>
              )}
            </div>

            {/* Editorial Information Tabs */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex border-b border-white/10 gap-4 text-xs font-mono uppercase tracking-wider mb-3">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'specs' ? 'border-white text-white font-bold' : 'border-transparent text-[#C7BDB7]'
                  }`}
                >
                  Specs & Fabric
                </button>
                <button
                  onClick={() => setActiveTab('measurements')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'measurements' ? 'border-white text-white font-bold' : 'border-transparent text-[#C7BDB7]'
                  }`}
                >
                  Fit Guide
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'reviews' ? 'border-white text-white font-bold' : 'border-transparent text-[#C7BDB7]'
                  }`}
                >
                  Reviews ({product.reviews?.length || 1})
                </button>
              </div>

              {activeTab === 'specs' && (
                <div className="text-xs space-y-2 text-[#C7BDB7] leading-relaxed">
                  <p><strong className="text-white">Fabric:</strong> {product.fabric}</p>
                  <p><strong className="text-white">Density:</strong> {product.gsm} GSM Custom Heavyweight Blank</p>
                  <p><strong className="text-white">Dye/Wash:</strong> Pre-shrunk, bio-washed, siliconized finish</p>
                  <p><strong className="text-white">Care:</strong> Cold machine wash inside-out. Do not tumble dry.</p>
                </div>
              )}

              {activeTab === 'measurements' && (
                <div className="overflow-x-auto text-[11px] font-mono">
                  <table className="w-full border border-white/10 text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-white">
                      <tr>
                        <th className="p-1.5">Size</th>
                        <th className="p-1.5">Chest</th>
                        <th className="p-1.5">Length</th>
                        <th className="p-1.5">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[#C7BDB7]">
                      {product.measurements?.map((m) => (
                        <tr key={m.size} className={selectedSize === m.size ? 'bg-white/10 text-white font-bold' : ''}>
                          <td className="p-1.5">{m.size}</td>
                          <td className="p-1.5">{m.chest}</td>
                          <td className="p-1.5">{m.length}</td>
                          <td className="p-1.5">{m.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-2.5 bg-white/5 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-white">{rev.author}</span>
                          <span className="text-[#C7BDB7]">{rev.date}</span>
                        </div>
                        <p className="text-xs text-[#C7BDB7] italic">"{rev.comment}"</p>
                        <div className="text-[10px] font-mono text-emerald-400">
                          Verified Buyer · Size {rev.sizePurchased}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#C7BDB7]">
                      5.0 ★ · High customer rating based on 30+ verified purchases.
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
