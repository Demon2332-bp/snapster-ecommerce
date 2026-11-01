import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, Tag, Package, Shield, Phone, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SnapsterLogo } from './SnapsterLogo';
import { Currency } from '../types/store';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setActiveCategory,
    goBack,
    canGoBack,
    cartCount,
    wishlistCount,
    currency,
    setCurrency,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    openAuthModal,
    user,
    isAdmin,
    setIsAdminManagerOpen,
    setIsOffersOpen,
    setIsOrderTrackingOpen,
    isMenuOpen,
    setIsMenuOpen,
    showToast,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' as const },
    { label: 'Shop', view: 'shop' as const },
    { label: 'Collections', view: 'collections' as const },
    { label: 'About', view: 'about' as const },
    { label: 'Journal', view: 'journal' as const },
    { label: 'Contact', view: 'contact' as const },
  ];

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  const handleNavClick = (view: 'home' | 'shop' | 'collections' | 'about' | 'journal' | 'contact') => {
    setCurrentView(view);
    if (view === 'shop') {
      setActiveCategory(null);
    }
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    if (currentView !== 'home') {
      goBack();
    } else {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      } else {
        goBack();
      }
    }
  };

  return (
    <>
      {/* Top Promotional Announcement Banner */}
      <div className="relative z-50 bg-[#21040D] text-[#F6F1E9] text-[10px] sm:text-[11px] font-mono py-2 px-4 border-b border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90">YOUR DAY. YOUR DRIP. // DISPATCHING FROM VIJAYAWADA AP HUB</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsOffersOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
            >
              <Tag size={12} className="text-[#C7BDB7] group-hover:text-white" />
              <span>Code <strong className="text-white font-bold underline">EDGE20</strong> for 20% off</span>
            </button>

            {/* Vijayawada Studio Tag */}
            <div className="hidden md:flex items-center gap-1 text-[#C7BDB7] border-l border-white/15 pl-3">
              <span className="text-emerald-400 font-bold">📍 Vijayawada, AP</span>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer border-l border-white/15 pl-3"
              >
                <span className="font-bold">{currency}</span>
                <ChevronDown size={11} />
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-[#1A181A] border border-white/20 shadow-2xl py-1 z-50 text-xs min-w-[80px]">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-1 hover:bg-white/10 ${
                        currency === c ? 'text-white font-bold bg-white/5' : 'text-[#C7BDB7]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Track Order Button (Requires Customer Login) */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('customer');
                } else {
                  setIsOrderTrackingOpen(true);
                }
              }}
              className="flex items-center gap-1 text-[#C7BDB7] hover:text-white transition-colors cursor-pointer border-l border-white/15 pl-3"
              title="Live Order Tracking (Login Required)"
            >
              <Package size={12} />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#24050E]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,.28)] py-2.5 border-b border-white/10'
            : 'bg-[#300611] py-3.5 md:py-4.5 border-b border-white/[0.08]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Hamburger & Back Arrow Navigation */}
          <div className="flex items-center gap-1.5 md:hidden">
            {currentView !== 'home' && (
              <button
                onClick={handleBackClick}
                className="p-1.5 text-[#F6F1E9] hover:text-white transition-colors focus:outline-none flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Go back to previous page"
                title="Go back to previous page"
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-[#F6F1E9] hover:text-white transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Left / Desktop Logo & Back Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Back Arrow Button - Only shown when not on home page */}
            {currentView !== 'home' && (
              <button
                onClick={handleBackClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/70 active:scale-95 text-[#F6F1E9] hover:text-white rounded border border-white/15 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group shadow-sm"
                aria-label="Go back"
                title="Go back to previous page"
              >
                <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1 text-white" />
                <span className="font-bold">Back</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('home')}
              className="group flex items-center text-left focus:outline-none cursor-pointer"
              aria-label="SNAPSTER Home"
            >
              <SnapsterLogo size="md" variant="light" />
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-[11px] lg:text-xs font-semibold tracking-[.13em] uppercase text-[#F6F1E9]/75">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className={`relative py-1 transition-colors duration-200 hover:text-white whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-white font-bold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 text-[#F6F1E9]">
            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:text-white transition-colors hover:scale-105 active:scale-95 focus:outline-none cursor-pointer flex items-center gap-1.5 bg-black/30 hover:bg-black/50 px-2.5 py-1.5 rounded border border-white/10"
              aria-label="Search catalog"
              title="Search catalog"
            >
              <Search size={16} strokeWidth={2} />
              <span className="hidden xl:inline text-xs font-mono text-[#C7BDB7]">Search tees, hoodies...</span>
            </button>

            {/* Account / User / Admin Authentication CTA */}
            {isAdmin ? (
              <button
                onClick={() => setIsAdminManagerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                title="Open Admin Management Console"
              >
                <Shield size={13} strokeWidth={2.5} />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            ) : user ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-white/15 cursor-pointer shadow-sm"
                title="Account & Orders"
              >
                <User size={13} className="text-emerald-400" />
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                <span className="sm:hidden">Account</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('customer')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#F6F1E9] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                title="Sign in with mobile number and OTP"
              >
                <User size={13} />
                <span>Login</span>
              </button>
            )}

            {/* Saved Wishlist (Auth-Gated) */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('customer');
                  showToast('Please log in with mobile number to view saved items', 'info');
                } else {
                  setIsWishlistOpen(true);
                }
              }}
              className="relative p-1.5 hover:text-white transition-colors hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
              aria-label={`Wishlist with ${wishlistCount} items`}
              title="Saved Items (Wishlist)"
            >
              <Heart size={19} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#4A0718] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono leading-none shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart (Auth-Gated) */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('customer');
                  showToast('Please log in with mobile number to view your Bag', 'info');
                } else {
                  setIsCartOpen(true);
                }
              }}
              className="relative p-1.5 hover:text-white transition-colors hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
              aria-label={`Shopping bag with ${cartCount} items`}
              title="Shopping Bag"
            >
              <ShoppingBag size={19} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-white text-[#4A0718] font-extrabold text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-mono leading-none shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Flipkart-Style Category Navigation Strip */}
      <div className="bg-[#181618] border-b border-white/10 text-xs text-[#F6F1E9] overflow-x-auto no-scrollbar shadow-inner">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-7 shrink-0 font-medium">
            <button
              onClick={() => {
                setActiveCategory(null);
                setCurrentView('shop');
              }}
              className="hover:text-white transition-colors text-white font-bold whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs uppercase font-mono"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>All Streetwear</span>
            </button>
            {['T-Shirts', 'Shirts', 'Hoodies', 'Joggers', 'Cargos', 'Denim'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentView('shop');
                }}
                className="hover:text-white text-[#C7BDB7] hover:underline transition-colors whitespace-nowrap cursor-pointer text-[11px] sm:text-xs font-semibold uppercase tracking-wider"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/30 px-2.5 py-0.5 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SNAPSTER Assured // Vijayawada Hub Quality Tested</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#111011] text-[#F6F1E9] animate-fade-in">
          <div className="flex items-center justify-between p-4 bg-[#4A0718] border-b border-white/10">
            <SnapsterLogo size="sm" variant="light" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-white hover:opacity-80"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
            <div className="space-y-6">
              <p className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7]">Navigation</p>
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.view)}
                    className="block w-full text-left text-2xl font-black uppercase font-headline tracking-wider text-white hover:text-[#C7BDB7] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[11px] font-mono tracking-widest uppercase text-[#C7BDB7] mb-3">Categories</p>
                <div className="grid grid-cols-2 gap-3 text-sm font-semibold uppercase text-white/80">
                  {['T-Shirts', 'Shirts', 'Hoodies', 'Joggers', 'Cargos', 'Denim'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCurrentView('shop');
                        setIsMenuOpen(false);
                      }}
                      className="text-left py-1 hover:text-white cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                {isAdmin ? (
                  <button
                    onClick={() => {
                      setIsAdminManagerOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-amber-500 text-black text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Shield size={14} />
                    <span>Admin Management Console</span>
                  </button>
                ) : user ? (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-white/15 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone size={14} className="text-emerald-400" />
                    <span>Logged In: {user.phone || user.name}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal('customer');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Phone size={14} />
                    <span>Login with Mobile Number</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (!user) {
                      openAuthModal('customer');
                      showToast('Please log in with mobile number to track orders', 'info');
                    } else {
                      setIsOrderTrackingOpen(true);
                    }
                  }}
                  className="w-full py-2 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Package size={14} />
                  <span>Track Active Order</span>
                </button>

                {/* Mobile Quick Bag & Wishlist */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (!user) {
                        openAuthModal('customer');
                        showToast('Please log in to view Saved items', 'info');
                      } else {
                        setIsWishlistOpen(true);
                      }
                    }}
                    className="py-2 px-2 bg-white/5 hover:bg-white/15 text-white text-xs font-mono uppercase flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Heart size={13} className="text-red-400" />
                    <span>Saved ({wishlistCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (!user) {
                        openAuthModal('customer');
                        showToast('Please log in to view your Bag', 'info');
                      } else {
                        setIsCartOpen(true);
                      }
                    }}
                    className="py-2 px-2 bg-white/5 hover:bg-white/15 text-white text-xs font-mono uppercase flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <ShoppingBag size={13} />
                    <span>Bag ({cartCount})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2 text-xs text-[#C7BDB7]">
              <div className="flex items-center justify-between">
                <span>Hub / Region</span>
                <span className="font-bold text-white">Vijayawada, Andhra Pradesh</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Currency</span>
                <span className="font-bold text-white">{currency} · Live Rates</span>
              </div>
              <p className="text-[10px] text-white/50 pt-1">© 2026 SNAPSTER // YOUR DAY. YOUR DRIP.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
