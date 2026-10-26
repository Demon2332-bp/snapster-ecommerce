import React from 'react';
import { Shield, Edit3, PlusCircle, LogOut, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminBar: React.FC = () => {
  const {
    isAdmin,
    setIsAdminManagerOpen,
    openAdminPostProduct,
    logout,
    products,
  } = useStore();

  if (!isAdmin) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black px-4 py-2 border-b border-amber-400 font-mono shadow-lg relative z-40">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 font-black tracking-wider uppercase">
          <div className="w-2 h-2 rounded-full bg-black animate-ping" />
          <Shield size={14} className="stroke-[2.5]" />
          <span>ADMIN ACCESS ACTIVE // CATALOG CONTROL ({products.length} PIECES)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminManagerOpen(true)}
            className="px-3 py-1 bg-black text-amber-400 hover:bg-neutral-900 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Edit3 size={12} />
            <span>Edit Pictures & Prices</span>
          </button>

          <button
            onClick={openAdminPostProduct}
            className="px-3 py-1 bg-white text-black hover:bg-neutral-100 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle size={12} />
            <span>+ Post New Product</span>
          </button>

          <button
            onClick={logout}
            className="px-2.5 py-1 bg-black/20 hover:bg-black hover:text-white text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ml-1"
            title="Log out of Admin"
          >
            <LogOut size={12} />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
