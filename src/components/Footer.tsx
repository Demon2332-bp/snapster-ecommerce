import React from 'react';
import { ChevronDown, Clock, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SnapsterLogo } from './SnapsterLogo';
import { Currency } from '../types/store';
import { CONTACT_CONFIG } from '../config/contactConfig';
import { WhatsAppIcon, InstagramBrandIcon, Phone } from './ContactIcons';

export const Footer: React.FC = () => {
  const {
    setCurrentView,
    setActiveCategory,
    currency,
    setCurrency,
    setIsSizeGuideOpen,
    setIsOffersOpen,
    setIsOrderTrackingOpen,
    openAuthModal,
    openPolicyModal,
    isAdmin,
    setIsAdminManagerOpen,
  } = useStore();

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (view: 'home' | 'shop' | 'collections' | 'about' | 'journal' | 'contact') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <footer className="w-full bg-[#0D0C0D] text-[#C7BDB7] pt-12 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 select-none">
      <div className="max-w-[1440px] mx-auto space-y-12">

        {/* 1. DIRECT CONCIERGE CHANNELS (Phone, WhatsApp, Instagram) */}
        <div className="border border-white/10 bg-[#141214] p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">
                DIRECT CLIENT ACCESS • VIJAYAWADA AP HUB
              </span>
              <h3 className="text-lg sm:text-xl font-headline font-black uppercase text-white tracking-wide">
                SNAPSTER CLIENT CONCIERGE
              </h3>
            </div>
            <button
              onClick={() => handleNavClick('contact')}
              className="self-start sm:self-auto text-xs font-mono uppercase text-[#F6F1E9] hover:text-white underline underline-offset-4 cursor-pointer flex items-center gap-1.5"
            >
              <span>Open Dedicated Contact Page &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* CHANNEL 1: PHONE (Call Us) */}
            <div className="bg-[#191719] border border-white/10 p-5 flex flex-col justify-between hover:border-white/30 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <a
                    href={CONTACT_CONFIG.phone.telHref}
                    className="w-10 h-10 bg-white/5 group-hover:bg-[#4A0718] flex items-center justify-center border border-white/15 text-white transition-colors cursor-pointer"
                    title="Click to dial SNAPSTER phone line"
                    aria-label="Call SNAPSTER Phone"
                  >
                    <Phone size={18} className="text-emerald-400 group-hover:text-white transition-colors" />
                  </a>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold">
                    VOICE CONCIERGE
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-[#C7BDB7] tracking-wider">
                    DIRECT CALL LINE
                  </div>
                  <a
                    href={CONTACT_CONFIG.phone.telHref}
                    className="text-base sm:text-lg font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    {CONTACT_CONFIG.phone.display}
                  </a>
                </div>

                <div className="text-[11px] font-mono text-[#C7BDB7]/80 flex items-center gap-1.5">
                  <Clock size={12} className="shrink-0" />
                  <span>{CONTACT_CONFIG.phone.hours}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <a
                  href={CONTACT_CONFIG.phone.telHref}
                  className="w-full py-2.5 px-3 bg-white hover:bg-[#F6F1E9] text-[#111011] font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-[0.98]"
                  title="Click to open dialer with pre-filled number"
                >
                  <Phone size={13} />
                  <span>CALL US</span>
                </a>
                <span className="text-[9px] font-mono text-[#C7BDB7]/70 text-center block mt-1.5">
                  Opens default dialer • User taps call
                </span>
              </div>
            </div>

            {/* CHANNEL 2: WHATSAPP BUSINESS (Chat with Us) */}
            <div className="bg-[#191719] border border-white/10 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <a
                    href={CONTACT_CONFIG.whatsapp.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-emerald-950/40 group-hover:bg-emerald-600 flex items-center justify-center border border-emerald-500/30 text-emerald-400 group-hover:text-white transition-colors cursor-pointer"
                    title="Open WhatsApp chat with SNAPSTER"
                    aria-label="Chat on WhatsApp"
                  >
                    <WhatsAppIcon size={20} />
                  </a>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-[#C7BDB7] tracking-wider">
                    WHATSAPP BUSINESS
                  </div>
                  <a
                    href={CONTACT_CONFIG.whatsapp.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    {CONTACT_CONFIG.whatsapp.display}
                  </a>
                </div>

                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="shrink-0" />
                  <span>Instant Sizing &amp; Tracking Concierge</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <a
                  href={CONTACT_CONFIG.whatsapp.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-[0.98]"
                >
                  <WhatsAppIcon size={14} />
                  <span>CHAT WITH US</span>
                </a>
                <span className="text-[9px] font-mono text-[#C7BDB7]/70 text-center block mt-1.5">
                  Direct WhatsApp link • Instant replies
                </span>
              </div>
            </div>

            {/* CHANNEL 3: INSTAGRAM (Official Profile) */}
            <div className="bg-[#191719] border border-white/10 p-5 flex flex-col justify-between hover:border-pink-500/40 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <a
                    href={CONTACT_CONFIG.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 group-hover:bg-gradient-to-tr group-hover:from-amber-600 group-hover:via-rose-600 group-hover:to-purple-600 flex items-center justify-center border border-white/15 text-pink-400 group-hover:text-white transition-all cursor-pointer"
                    title="Visit official SNAPSTER Instagram"
                    aria-label="SNAPSTER Instagram Profile"
                  >
                    <InstagramBrandIcon size={18} />
                  </a>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-white/5 text-pink-300 border border-white/15 font-bold">
                    OFFICIAL
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-[#C7BDB7] tracking-wider">
                    SNAPSTER INSTAGRAM
                  </div>
                  <a
                    href={CONTACT_CONFIG.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-mono font-bold text-white hover:text-pink-400 transition-colors"
                  >
                    {CONTACT_CONFIG.instagram.handle}
                  </a>
                </div>

                <div className="text-[11px] font-mono text-[#C7BDB7]/80 flex items-center gap-1.5">
                  <ExternalLink size={12} className="shrink-0" />
                  <span>Lookbooks, Drops &amp; Design Archives</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <a
                  href={CONTACT_CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-[0.98] border border-white/20"
                >
                  <InstagramBrandIcon size={14} />
                  <span>VISIT INSTAGRAM</span>
                </a>
                <span className="text-[9px] font-mono text-[#C7BDB7]/70 text-center block mt-1.5">
                  Follow for official drop countdowns
                </span>
              </div>
            </div>

          </div>
        </div>
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <SnapsterLogo size="lg" variant="light" />
            <p className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase font-sans">
              YOUR DAY. YOUR DRIP.
            </p>
            <p className="text-xs leading-relaxed text-[#C7BDB7] max-w-sm font-sans">
              SNAPSTER is an international luxury streetwear label defined by oversized heavyweight cuts, architectural silhouettes, and uncompromising quality. Built different.
            </p>
            
            <div className="pt-2 text-[11px] font-mono text-[#C7BDB7]/90 flex flex-col gap-1">
              <span className="text-white font-bold tracking-wider">FLAGSHIP STUDIO &amp; HEADQUARTERS</span>
              <span>MG Road, Vijayawada, Andhra Pradesh 520010</span>
              <span className="text-emerald-400 text-[10px]">Serving Vijayawada &amp; all districts across Andhra Pradesh</span>
            </div>

            {/* Quick Contact Icons Strip */}
            <div className="pt-3 flex items-center gap-2.5">
              <a
                href={CONTACT_CONFIG.phone.telHref}
                className="p-2 bg-white/5 hover:bg-white/15 text-white rounded border border-white/10 transition-colors"
                title="Call SNAPSTER Phone"
                aria-label="Call SNAPSTER"
              >
                <Phone size={14} className="text-emerald-400" />
              </a>

              <a
                href={CONTACT_CONFIG.whatsapp.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/15 text-white rounded border border-white/10 transition-colors"
                title="Chat on WhatsApp"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={14} className="text-emerald-400" />
              </a>

              <a
                href={CONTACT_CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/15 text-white rounded border border-white/10 transition-colors"
                title="Follow on Instagram"
                aria-label="Instagram"
              >
                <InstagramBrandIcon size={14} className="text-pink-400" />
              </a>

              <a
                href={CONTACT_CONFIG.email.mailto}
                className="p-2 bg-white/5 hover:bg-white/15 text-white rounded border border-white/10 transition-colors"
                title="Email Concierge"
                aria-label="Email"
              >
                <Mail size={14} className="text-[#C7BDB7]" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              SHOP
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleNavClick('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  New Arrivals
                </button>
              </li>
              {['T-Shirts', 'Shirts', 'Hoodies', 'Joggers', 'Cargos', 'Denim'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-emerald-400 font-bold transition-colors cursor-pointer flex items-center gap-1.5">
                  <span>Contact Us (Call / WA / IG)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-white transition-colors cursor-pointer">
                  About SNAPSTER
                </button>
              </li>
              <li>
                <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  Size &amp; Fit Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setIsOffersOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  Promotions &amp; Privileges
                </button>
              </li>
              <li>
                <button onClick={() => setIsOrderTrackingOpen(true)} className="hover:text-white transition-colors cursor-pointer text-emerald-400 font-bold">
                  Track Your Order (Live)
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('returns')} className="hover:text-white transition-colors cursor-pointer">
                  Returns &amp; Size Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('fabric')} className="hover:text-white transition-colors cursor-pointer">
                  Fabric &amp; Wash Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              INFORMATION
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Vijayawada Flagship Concierge
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('journal')} className="hover:text-white transition-colors cursor-pointer">
                  Editorial Journal
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => openPolicyModal('shipping')} className="hover:text-white transition-colors cursor-pointer">
                  Vijayawada Shipping Guide
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Currency */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#C7BDB7]/70">
          <div>
            &copy; 2026 SNAPSTER APPAREL CO. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => openPolicyModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => openPolicyModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => openPolicyModal('shipping')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping
            </button>

            {/* Discreet Staff Portal */}
            <button
              onClick={() => {
                if (isAdmin) {
                  setIsAdminManagerOpen(true);
                } else {
                  openAuthModal('admin');
                }
              }}
              className="hover:text-amber-300 transition-colors cursor-pointer opacity-30 hover:opacity-100"
              title="Staff & Management Portal"
            >
              Staff Portal
            </button>

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 border border-white/20 px-2.5 py-1 text-white">
              <span className="text-[#C7BDB7]">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
              >
                {currencies.map((c) => (
                  <option key={c} value={c} className="bg-[#111011] text-white">
                    {c} ({c === 'INR' ? '₹' : c === 'USD' ? '$' : c === 'EUR' ? '€' : '£'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
