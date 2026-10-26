import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { SnapsterLogo } from './SnapsterLogo';
import { useStore } from '../context/StoreContext';
import { CONTACT_CONFIG } from '../config/contactConfig';
import { WhatsAppIcon, InstagramBrandIcon } from './ContactIcons';

export const AboutPage: React.FC = () => {
  const { showToast, goBack } = useStore();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    setIsSent(true);
    showToast('Your message has been received by our concierge.', 'success');
  };

  return (
    <div className="w-full bg-[#111011] text-[#F6F1E9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* Navigation Breadcrumb & Back Arrow */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-[#F6F1E9] hover:text-white rounded border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group"
            title="Return to previous / main page"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Main Page</span>
          </button>

          <span className="hidden sm:inline-block text-[11px] font-mono text-[#C7BDB7]">
            HOME &gt; ABOUT SNAPSTER
          </span>
        </div>

        {/* Brand Manifesto Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <SnapsterLogo size="xl" variant="light" className="mx-auto" showTagline={true} />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase font-headline tracking-tight text-white">
            YOUR DAY. YOUR DRIP.
          </h1>
          <p className="text-base sm:text-lg text-[#C7BDB7] leading-relaxed font-sans">
            SNAPSTER was founded on a singular conviction: contemporary streetwear deserves the uncompromising craftsmanship, heavy fabrications, and architectural proportions of high fashion.
          </p>
        </div>

        {/* Brand Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[#171517] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#78132D] font-bold">Pillar 01</span>
            <h3 className="text-xl font-headline uppercase text-white">HEAVYWEIGHT DENSITY</h3>
            <p className="text-xs sm:text-sm text-[#C7BDB7] leading-relaxed">
              We engineer our tees at 260–280 GSM and our fleece hoodies at 450+ GSM French Terry. Nothing flimsy, nothing that wrinkles after one wash.
            </p>
          </div>

          <div className="p-8 bg-[#171517] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#78132D] font-bold">Pillar 02</span>
            <h3 className="text-xl font-headline uppercase text-white">ARCHITECTURAL CUTS</h3>
            <p className="text-xs sm:text-sm text-[#C7BDB7] leading-relaxed">
              Drop shoulders, high-collar ribbing, articulated knee darts, and intentional drape inspired by modern brutalist urban environments.
            </p>
          </div>

          <div className="p-8 bg-[#171517] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#78132D] font-bold">Pillar 03</span>
            <h3 className="text-xl font-headline uppercase text-white">ANTI-FAST FASHION</h3>
            <p className="text-xs sm:text-sm text-[#C7BDB7] leading-relaxed">
              We release disciplined, numbered drops. Limited units prevent deadstock, respect labor, and maintain silhouette exclusivity.
            </p>
          </div>
        </div>

        {/* Exclusive Branch & Flagship Showcase */}
        <div className="bg-[#1A181A] border border-[#78132D]/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#4A0718] text-white text-[10px] font-mono uppercase tracking-wider font-bold">
              <span>EXCLUSIVE FLAGSHIP STORE & HEADQUARTERS</span>
            </div>
            <h3 className="text-2xl font-black uppercase font-headline text-white">
              VIJAYAWADA, ANDHRA PRADESH
            </h3>
            <p className="text-xs sm:text-sm text-[#C7BDB7] max-w-xl">
              Visit our flagship concept store and design studio on MG Road, Vijayawada. Experience all heavyweight fabrics, custom tailoring fittings, and exclusive limited drops in person.
            </p>
          </div>
          <div className="shrink-0 text-left md:text-right font-mono text-xs text-[#C7BDB7] space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-white font-bold">SNAPSTER Flagship Studio</div>
            <div>MG Road, Labbipet</div>
            <div>Vijayawada, Andhra Pradesh 520010</div>
            <div className="text-emerald-400 font-bold">Open Daily: 10:30 AM – 9:30 PM</div>
          </div>
        </div>

        {/* Concierge & Support Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#191719] border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#C7BDB7] tracking-widest block mb-1">
                Direct Client Support
              </span>
              <h2 className="text-3xl font-black uppercase font-headline text-white">
                CONCIERGE & INQUIRIES
              </h2>
              <p className="text-xs sm:text-sm text-[#C7BDB7] mt-2 leading-relaxed">
                Have questions about sizing, fabric weights, order dispatch, or corporate drops? Reach our Vijayawada studio team directly.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono text-[#C7BDB7]">
              {/* Phone Line with Call Us */}
              <div className="p-3 bg-[#111011] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <a
                    href={CONTACT_CONFIG.phone.telHref}
                    className="p-2 bg-white/5 hover:bg-emerald-950/60 text-emerald-400 border border-white/10 transition-colors"
                    title="Click to dial phone number"
                    aria-label="Call SNAPSTER Phone"
                  >
                    <Phone size={15} />
                  </a>
                  <div>
                    <div className="text-white font-bold">{CONTACT_CONFIG.phone.display}</div>
                    <div className="text-[10px] text-[#C7BDB7]">{CONTACT_CONFIG.phone.hours}</div>
                  </div>
                </div>
                <a
                  href={CONTACT_CONFIG.phone.telHref}
                  className="px-3 py-1.5 bg-white hover:bg-[#F6F1E9] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone size={11} />
                  <span>Call Us</span>
                </a>
              </div>

              {/* WhatsApp Business with Chat with Us */}
              <div className="p-3 bg-[#111011] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <a
                    href={CONTACT_CONFIG.whatsapp.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors"
                    title="Chat on WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon size={16} />
                  </a>
                  <div>
                    <div className="text-white font-bold">WhatsApp Business</div>
                    <div className="text-[10px] text-emerald-400">Instant VIP Concierge</div>
                  </div>
                </div>
                <a
                  href={CONTACT_CONFIG.whatsapp.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <WhatsAppIcon size={12} />
                  <span>Chat with Us</span>
                </a>
              </div>

              {/* Official Instagram */}
              <div className="p-3 bg-[#111011] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <a
                    href={CONTACT_CONFIG.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 text-pink-400 border border-white/10 hover:bg-white hover:text-black transition-colors"
                    title="Visit official Instagram"
                    aria-label="Instagram"
                  >
                    <InstagramBrandIcon size={16} />
                  </a>
                  <div>
                    <div className="text-white font-bold">{CONTACT_CONFIG.instagram.handle}</div>
                    <div className="text-[10px] text-[#C7BDB7]">Official Lookbooks &amp; Drops</div>
                  </div>
                </div>
                <a
                  href={CONTACT_CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black font-black text-[11px] uppercase tracking-wider border border-white/20 transition-colors cursor-pointer"
                >
                  Follow
                </a>
              </div>

              {/* Physical Flagship Studio */}
              <div className="pt-1 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2.5 text-white">
                  <MapPin size={14} className="text-[#4A0718] shrink-0" />
                  <span>{CONTACT_CONFIG.location.fullFormatted}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#C7BDB7]">
                  <Mail size={14} className="text-[#4A0718] shrink-0" />
                  <a href={CONTACT_CONFIG.email.mailto} className="hover:text-white underline">
                    {CONTACT_CONFIG.email.address}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {isSent ? (
              <div className="p-8 bg-[#4A0718]/40 border border-[#78132D] flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 size={32} className="text-[#C7BDB7]" />
                <h4 className="text-lg font-headline uppercase text-white">
                  MESSAGE TRANSMITTED
                </h4>
                <p className="text-xs text-[#C7BDB7] max-w-sm">
                  Our client specialist will review your inquiry and respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="arjun@example.com"
                      className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                    Message / Order Inquiry
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we assist you with fits or orders?"
                    className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                >
                  <Send size={13} />
                  <span>DISPATCH MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
