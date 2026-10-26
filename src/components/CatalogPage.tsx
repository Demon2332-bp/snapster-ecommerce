import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, History, Sparkles, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const CatalogPage: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    recentlyViewed,
    products,
    goBack,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<'all' | 'under-2000' | '2000-3000' | 'above-3000'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'T-Shirts', 'Shirts', 'Hoodies', 'Joggers', 'Cargos', 'Denim'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Filter & sort calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory && activeCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize as any));
    }

    if (priceRange === 'under-2000') {
      result = result.filter((p) => p.price < 2000);
    } else if (priceRange === '2000-3000') {
      result = result.filter((p) => p.price >= 2000 && p.price <= 3000);
    } else if (priceRange === 'above-3000') {
      result = result.filter((p) => p.price > 3000);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, activeCategory, selectedSize, priceRange, sortBy]);

  const activeCategoryData = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === (activeCategory || '').toLowerCase()
  );

  const resetFilters = () => {
    setActiveCategory(null);
    setSelectedSize(null);
    setPriceRange('all');
    setSortBy('featured');
  };

  const recentlyViewedProducts = products.filter((p) =>
    recentlyViewed.includes(p.id)
  ).slice(0, 4);

  return (
    <div className="w-full bg-[#111011] text-[#F6F1E9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Navigation Breadcrumb & Back Arrow */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-[#F6F1E9] hover:text-white rounded border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group"
            title="Return to previous / main page"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Main Page</span>
          </button>

          <span className="hidden sm:inline-block text-[11px] font-mono text-[#C7BDB7]">
            HOME &gt; CATALOG {activeCategory ? `&gt; ${activeCategory.toUpperCase()}` : ''}
          </span>
        </div>

        {/* Banner / Title Header */}
        <div className="mb-8 pb-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7] flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-[#4A0718]" />
                Full Catalog // 2026 Archive ({products.length} Silhouettes)
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-headline tracking-wide text-white">
                {activeCategory ? activeCategory.toUpperCase() : 'ALL STREETWEAR'}
              </h1>
              {activeCategoryData && (
                <p className="mt-1 text-xs sm:text-sm text-[#C7BDB7] max-w-xl">
                  {activeCategoryData.tagline}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#C7BDB7]">
                Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} pieces
              </span>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal size={13} />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills / Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = (!activeCategory && cat === 'All') || activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === 'All' ? null : cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#111011] shadow-md font-extrabold'
                    : 'bg-[#1C1A1C] text-[#C7BDB7] hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Filter Sidebar (Desktop) */}
          <div
            className={`lg:block ${
              mobileFilterOpen
                ? 'fixed inset-0 z-50 bg-[#141314] p-6 overflow-y-auto block'
                : 'hidden'
            } lg:relative lg:inset-auto lg:bg-transparent lg:p-0 space-y-6`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-white/10 lg:hidden">
                <h3 className="text-lg font-black uppercase font-headline">FILTERS</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-white"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Sorting */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7] block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#1A181A] border border-white/15 text-white text-xs px-3 py-2.5 font-mono focus:outline-none"
              >
                <option value="featured">Featured Drops</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7]">
                  Size
                </label>
                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize(null)}
                    className="text-[10px] font-mono text-[#C7BDB7] underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                    className={`py-2 text-xs font-bold uppercase transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#4A0718] text-white border border-[#78132D]'
                        : 'bg-white/5 border border-white/10 text-[#C7BDB7] hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7] block">
                Price Range
              </label>
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-2000', label: 'Under ₹2,000' },
                  { id: '2000-3000', label: '₹2,000 – ₹3,000' },
                  { id: 'above-3000', label: 'Above ₹3,000' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-white"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === item.id}
                      onChange={() => setPriceRange(item.id as any)}
                      className="accent-[#4A0718]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset All */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={resetFilters}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>

            {mobileFilterOpen && (
              <div className="pt-6 lg:hidden">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-white text-[#111011] font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            )}
          </div>

          {/* Right Product Grid using ProductCard with secondary hover & smooth Add to Cart */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white/[0.02] border border-white/10 p-8">
                <h3 className="text-xl font-headline uppercase text-white">
                  NO PIECES MATCH YOUR CRITERIA
                </h3>
                <p className="text-xs text-[#C7BDB7] max-w-sm mx-auto">
                  Try clearing your filters or selecting a different size or category to discover other silhouettes.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-white text-[#111011] font-black text-xs uppercase tracking-widest cursor-pointer"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} theme="dark" />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Recently Viewed Products Bar */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#C7BDB7] mb-6">
              <History size={14} className="text-[#4A0718]" />
              <span>Recently Viewed Pieces</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={`recent-${p.id}`} product={p} theme="dark" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
