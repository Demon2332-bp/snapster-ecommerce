import React from 'react';
import {
  X,
  Truck,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CONTACT_CONFIG } from '../config/contactConfig';
import { WhatsAppIcon, InstagramBrandIcon, Phone } from './ContactIcons';

export const PoliciesModal: React.FC = () => {
  const { isPoliciesOpen, setIsPoliciesOpen, policiesTab, setPoliciesTab } = useStore();

  if (!isPoliciesOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setIsPoliciesOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] bg-[#141314] text-[#F6F1E9] border border-white/15 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#1C1A1C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4A0718] flex items-center justify-center border border-white/10 text-white">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase font-headline tracking-wider text-white">
                SNAPSTER STORE POLICIES & STANDARDS
              </h3>
              <p className="text-[11px] font-mono text-[#C7BDB7]">
                Authentic Streetwear • Vijayawada AP Central Hub
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPoliciesOpen(false)}
            className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close policies modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#111011] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setPoliciesTab('shipping')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              policiesTab === 'shipping'
                ? 'border-[#4A0718] text-white bg-white/5'
                : 'border-transparent text-[#C7BDB7] hover:text-white'
            }`}
          >
            <Truck size={14} className={policiesTab === 'shipping' ? 'text-amber-400' : ''} />
            <span>Shipping & AP Delivery</span>
          </button>

          <button
            onClick={() => setPoliciesTab('returns')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              policiesTab === 'returns'
                ? 'border-[#4A0718] text-white bg-white/5'
                : 'border-transparent text-[#C7BDB7] hover:text-white'
            }`}
          >
            <RotateCcw size={14} className={policiesTab === 'returns' ? 'text-amber-400' : ''} />
            <span>7-Day Doorstep Returns</span>
          </button>

          <button
            onClick={() => setPoliciesTab('fabric')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              policiesTab === 'fabric'
                ? 'border-[#4A0718] text-white bg-white/5'
                : 'border-transparent text-[#C7BDB7] hover:text-white'
            }`}
          >
            <Sparkles size={14} className={policiesTab === 'fabric' ? 'text-amber-400' : ''} />
            <span>Fabric & Wash Guide</span>
          </button>

          <button
            onClick={() => setPoliciesTab('terms')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
              policiesTab === 'terms'
                ? 'border-[#4A0718] text-white bg-white/5'
                : 'border-transparent text-[#C7BDB7] hover:text-white'
            }`}
          >
            <ShieldCheck size={14} className={policiesTab === 'terms' ? 'text-amber-400' : ''} />
            <span>Privacy & Terms</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm font-sans leading-relaxed text-[#C7BDB7]">
          {/* TAB 1: SHIPPING & DELIVERY */}
          {policiesTab === 'shipping' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#1C1A1C] border border-white/10 p-4 rounded-none">
                <div className="flex items-center gap-2 text-white font-bold font-mono text-xs uppercase mb-1">
                  <MapPin size={15} className="text-emerald-400" />
                  <span>Central Distribution Hub: Vijayawada, Andhra Pradesh</span>
                </div>
                <p className="text-xs text-[#C7BDB7]">
                  All SNAPSTER drops are dispatched directly from our master fulfillment facility on MG Road, Vijayawada (PIN: 520010). Each package is sealed in high-barrier tamper-proof packaging.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-white/10 p-4 bg-black/40">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono mb-2">
                    <Clock size={14} className="text-emerald-400" />
                    <span>Vijayawada Local (PIN 520001 - 520015)</span>
                  </div>
                  <p className="text-xs text-[#C7BDB7]">
                    Same-Day Delivery for orders placed before 2:00 PM. All other local orders are hand-delivered within 24 hours.
                  </p>
                </div>

                <div className="border border-white/10 p-4 bg-black/40">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono mb-2">
                    <Truck size={14} className="text-blue-400" />
                    <span>Andhra Pradesh Districts</span>
                  </div>
                  <p className="text-xs text-[#C7BDB7]">
                    24 to 48 hours express transit to Visakhapatnam, Guntur, Tirupati, Kurnool, Kakinada, Rajahmundry, Nellore, and Anantapur via BlueDart Air.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  Shipping Costs & Free Thresholds
                </h4>
                <ul className="space-y-2 text-xs list-disc list-inside">
                  <li><strong className="text-white">Prepaid Orders:</strong> FREE express shipping on all orders over ₹1,999. Nominal flat fee of ₹99 for orders below ₹1,999.</li>
                  <li><strong className="text-white">Cash on Delivery (COD):</strong> Flat ₹120 handling charge across India. OTP verification is required at delivery.</li>
                  <li><strong className="text-white">Live Tracking:</strong> Instant BlueDart Air tracking number (AWB) sent via SMS & WhatsApp immediately upon dispatch.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: RETURNS & EXCHANGES */}
          {policiesTab === 'returns' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#4A0718]/30 border border-[#4A0718] p-4">
                <h4 className="text-sm font-bold text-white uppercase font-headline tracking-wide flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  7-Day Doorstep Size Replacement & Easy Returns
                </h4>
                <p className="text-xs text-[#C7BDB7] mt-1">
                  Streetwear fits are personal. If your oversized silhouette or cargo length isn't exact, we exchange it at your doorstep across Andhra Pradesh and India at zero additional cost.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  Exchange & Return Criteria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-white/10 p-3 bg-black/30 text-xs">
                    <span className="font-bold text-white block mb-1">1. Tags Attached</span>
                    Original woven SNAPSTER neck label and barcode hangtag must remain intact.
                  </div>
                  <div className="border border-white/10 p-3 bg-black/30 text-xs">
                    <span className="font-bold text-white block mb-1">2. Unworn & Clean</span>
                    Garment must be free of cologne scents, deodorant marks, pet dander, and washes.
                  </div>
                  <div className="border border-white/10 p-3 bg-black/30 text-xs">
                    <span className="font-bold text-white block mb-1">3. Matte Zip Pouch</span>
                    Return garment inside the reusable SNAPSTER slide pouch with moisture packets.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  Refund Process & Timelines
                </h4>
                <p className="text-xs text-[#C7BDB7]">
                  Refunds are initiated instantly upon warehouse pickup. UPI and card payments reflect in your source account within 24–48 banking hours. COD orders are refunded via direct IMPS bank transfer or instant SNAPSTER store credits (+5% bonus value).
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FABRIC CARE */}
          {policiesTab === 'fabric' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-xs text-[#C7BDB7]">
                SNAPSTER garments use ultra-dense European-grade ring-spun combed cottons and custom selvedge denims engineered to endure years of wear without fading or collar curling. Follow these guidelines to maintain your drip.
              </p>

              <div className="space-y-4">
                <div className="border border-white/10 p-4 bg-black/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs font-mono uppercase">
                      280 GSM Combed Cotton (Oversized Tees & Polos)
                    </span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 text-white font-mono">
                      HEAVYWEIGHT
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>Turn t-shirt inside out before washing to safeguard screenprints and puff prints.</li>
                    <li>Machine wash in cold water (max 30°C / 86°F) on gentle cycle.</li>
                    <li>Air dry flat in shade. Do not tumble dry to prevent shrinkage of pre-shrunk cotton.</li>
                    <li>Low heat iron on reverse side only. Never touch iron directly to graphic prints.</li>
                  </ul>
                </div>

                <div className="border border-white/10 p-4 bg-black/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs font-mono uppercase">
                      450 GSM French Terry (Hoodies & Zip Sweats)
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 font-mono">
                      ULTRA-DENSE
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>Zip all zippers and tie hood drawcords prior to placing in washing machine.</li>
                    <li>Cold wash only with mild eco-friendly detergent.</li>
                    <li>Lay flat across drying rack to prevent weight stretching shoulder seams.</li>
                  </ul>
                </div>

                <div className="border border-white/10 p-4 bg-black/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs font-mono uppercase">
                      14.5 oz Custom Japanese Twill (Cargos & Denim)
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 font-mono">
                      RIGID STRUCTURE
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>Wash infrequently to develop organic wear whiskers and distress patterns.</li>
                    <li>Hang dry outdoors in shaded ventilation.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & TERMS */}
          {policiesTab === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  Customer Privacy & Data Protection
                </h4>
                <p className="text-xs text-[#C7BDB7]">
                  At SNAPSTER APPAREL CO., customer privacy is paramount. Your mobile phone number, OTP authentication data, and delivery coordinates in Vijayawada or across Andhra Pradesh are encrypted using 256-bit SSL encryption. We never rent, sell, or disclose your contact data to third-party telemarketers.
                </p>
                <p className="text-xs text-[#C7BDB7]">
                  Your phone number is utilized solely to send one-time passcodes (OTP) for secure sign-in, order dispatch confirmations, and live BlueDart delivery updates.
                </p>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  Terms of Sale & Authenticity Guarantee
                </h4>
                <ul className="space-y-2 text-xs list-disc list-inside">
                  <li><strong className="text-white">100% Guaranteed Authenticity:</strong> All pieces sold on SNAPSTER are genuine proprietary releases crafted in limited small batches.</li>
                  <li><strong className="text-white">Pricing Transparency:</strong> All listed prices in INR (₹) are inclusive of all applicable GST taxes. What you see in cart is what you pay.</li>
                  <li><strong className="text-white">Jurisdiction:</strong> All commercial transactions are governed by the laws of India, subject to the exclusive jurisdiction of the courts of Vijayawada, Andhra Pradesh.</li>
                </ul>
              </div>

              <div className="border border-white/10 p-4 bg-[#1C1A1C] text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white uppercase font-mono">
                    Need Personalized Assistance?
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Direct Client Channels
                  </span>
                </div>
                <p className="text-[#C7BDB7]">
                  Speak directly with our concierge team in Vijayawada: <span className="text-white font-mono font-bold">{CONTACT_CONFIG.phone.display}</span> • {CONTACT_CONFIG.phone.hours}.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={CONTACT_CONFIG.phone.telHref}
                    className="px-3 py-1.5 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#F6F1E9] transition-colors"
                  >
                    <Phone size={12} />
                    <span>Call Us</span>
                  </a>
                  <a
                    href={CONTACT_CONFIG.whatsapp.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-black font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#20ba5a] transition-colors"
                  >
                    <WhatsAppIcon size={12} />
                    <span>Chat with Us</span>
                  </a>
                  <a
                    href={CONTACT_CONFIG.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/10 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-white hover:text-black border border-white/20 transition-colors"
                  >
                    <InstagramBrandIcon size={12} />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1C1A1C] border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#C7BDB7]">
            YOUR DAY. YOUR DRIP. • SNAPSTER APPAREL CO.
          </span>
          <button
            onClick={() => setIsPoliciesOpen(false)}
            className="px-5 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#F6F1E9] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
