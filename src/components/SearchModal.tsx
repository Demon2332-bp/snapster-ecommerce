import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.fabric.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const popularSearches = ['Hoodies', 'Cargos', '280 GSM Tee', 'Denim', 'Track Pants'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSearchOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-[#171617] text-[#F6F1E9] border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3">
          <Search size={20} className="text-[#C7BDB7] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search silhouettes, categories, GSM or fabrics..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-[#C7BDB7]/50 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#C7BDB7] hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#C7BDB7] hover:text-white px-2 py-1 bg-white/5 border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!searchTerm.trim() ? (
            <div className="space-y-4">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7]">
                Popular Inquiries
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 cursor-pointer transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-[#C7BDB7]">
              <p className="text-sm">No pieces found matching "{searchTerm}"</p>
              <p className="text-xs mt-1 text-[#C7BDB7]/60">Try searching for Hoodies, Denim, Cargos, or Tees</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#C7BDB7] pb-2 border-b border-white/5">
                <span>Matching Results ({filteredProducts.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setQuickViewProduct(product);
                      setIsSearchOpen(false);
                    }}
                    className="flex gap-3 p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer"
                  >
                    <div className="w-14 h-18 bg-[#201E20] shrink-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                      <span className="text-[10px] font-mono text-[#C7BDB7]">{product.category}</span>
                      <span className="text-xs font-mono font-bold text-white mt-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
