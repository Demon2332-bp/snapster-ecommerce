import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, ArrowLeft, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { SnapsterLogo } from './SnapsterLogo';
import { useStore } from '../context/StoreContext';
import { CONTACT_CONFIG } from '../config/contactConfig';
import { WhatsAppIcon, InstagramBrandIcon, Phone } from './ContactIcons';

export const ContactPage: React.FC = () => {
  const { showToast, goBack } = useStore();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('Product / Fit Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('Please fill out all mandatory fields.', 'error');
      return;
    }
    setIsSent(true);
    showToast('Your message has been dispatched to our Vijayawada concierge.', 'success');
  };

  return (
    <div className="w-full bg-[#111011] text-[#F6F1E9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto space-y-12">

        {/* Top Breadcrumb & Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-[#F6F1E9] hover:text-white rounded border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group"
            title="Return to previous / main page"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Main Page</span>
          </button>

          <span className="hidden sm:inline-block text-[11px] font-mono text-[#C7BDB7]">
            HOME &gt; CLIENT CONCIERGE &amp; CONTACT
          </span>
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <SnapsterLogo size="xl" variant="light" className="mx-auto" showTagline={true} />
          <h1 className="text-3xl sm:text-5xl font-black uppercase font-headline tracking-tight text-white">
            CONTACT CONCIERGE
          </h1>
          <p className="text-xs sm:text-sm text-[#C7BDB7] leading-relaxed max-w-xl mx-auto">
            Direct communication channels for bespoke fitting assistance, VIP orders, and dispatch tracking. Reach our Vijayawada, Andhra Pradesh headquarters instantly.
          </p>
        </div>

        {/* 3 Core Primary Contact Channels: Phone, WhatsApp, Instagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. Phone Support */}
          <div className="bg-[#181618] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-white/30 transition-all shadow-xl group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <a
                  href={CONTACT_CONFIG.phone.telHref}
                  className="w-12 h-12 bg-white/5 group-hover:bg-[#4A0718] flex items-center justify-center border border-white/15 text-white transition-colors cursor-pointer"
                  title="Click to dial SNAPSTER phone line"
                  aria-label="Call SNAPSTER Phone"
                >
                  <Phone size={22} className="text-emerald-400 group-hover:text-white transition-colors" />
                </a>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold">
                  DIRECT LINE
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7BDB7] block mb-1">
                  VOICE CONCIERGE
                </span>
                <h3 className="text-xl font-headline uppercase text-white font-black">
                  {CONTACT_CONFIG.phone.display}
                </h3>
              </div>

              <p className="text-xs text-[#C7BDB7] leading-relaxed">
                {CONTACT_CONFIG.phone.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#C7BDB7] pt-1">
                <Clock size={13} className="text-[#C7BDB7]" />
                <span>{CONTACT_CONFIG.phone.hours}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <a
                href={CONTACT_CONFIG.phone.telHref}
                className="w-full py-3 px-4 bg-white hover:bg-[#F6F1E9] text-[#111011] font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
              >
                <Phone size={14} />
                <span>CALL US</span>
              </a>
              <p className="text-[10px] font-mono text-[#C7BDB7]/80 text-center mt-2">
                Opens your device dialer with number pre-filled. Tap call to connect.
              </p>
            </div>
          </div>

          {/* 2. WhatsApp Business */}
          <div className="bg-[#181618] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xl group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <a
                  href={CONTACT_CONFIG.whatsapp.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-emerald-950/40 group-hover:bg-emerald-600 flex items-center justify-center border border-emerald-500/30 text-emerald-400 group-hover:text-white transition-colors cursor-pointer"
                  title="Open direct WhatsApp chat with SNAPSTER"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppIcon size={24} />
                </a>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7BDB7] block mb-1">
                  WHATSAPP BUSINESS
                </span>
                <h3 className="text-xl font-headline uppercase text-white font-black">
                  {CONTACT_CONFIG.whatsapp.display}
                </h3>
              </div>

              <p className="text-xs text-[#C7BDB7] leading-relaxed">
                {CONTACT_CONFIG.whatsapp.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-1">
                <ShieldCheck size={13} />
                <span>Verified Business Account</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <a
                href={CONTACT_CONFIG.whatsapp.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
              >
                <WhatsAppIcon size={16} />
                <span>CHAT WITH US</span>
              </a>
              <p className="text-[10px] font-mono text-[#C7BDB7]/80 text-center mt-2">
                Direct WhatsApp link • Instant replies during operational hours
              </p>
            </div>
          </div>

          {/* 3. Instagram Official */}
          <div className="bg-[#181618] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-pink-500/40 transition-all shadow-xl group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <a
                  href={CONTACT_CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 group-hover:bg-gradient-to-tr group-hover:from-amber-600 group-hover:via-rose-600 group-hover:to-purple-600 flex items-center justify-center border border-white/15 text-pink-400 group-hover:text-white transition-all cursor-pointer"
                  title="Visit SNAPSTER official Instagram"
                  aria-label="SNAPSTER Instagram Profile"
                >
                  <InstagramBrandIcon size={22} />
                </a>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 text-pink-300 border border-white/15 font-bold">
                  OFFICIAL PROFILE
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C7BDB7] block mb-1">
                  OFFICIAL INSTAGRAM
                </span>
                <h3 className="text-xl font-headline uppercase text-white font-black">
                  {CONTACT_CONFIG.instagram.handle}
                </h3>
              </div>

              <p className="text-xs text-[#C7BDB7] leading-relaxed">
                {CONTACT_CONFIG.instagram.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#C7BDB7] pt-1">
                <ExternalLink size={13} className="text-[#C7BDB7]" />
                <span>Drops &amp; Capsule Lookbooks</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <a
                href={CONTACT_CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98] border border-white/20"
              >
                <InstagramBrandIcon size={16} />
                <span>FOLLOW @SNAPSTER.OFFICIAL</span>
              </a>
              <p className="text-[10px] font-mono text-[#C7BDB7]/80 text-center mt-2">
                Official handles &amp; releases • Follow for drop announcements
              </p>
            </div>
          </div>

        </div>

        {/* Flagship Location & Inquiry Dispatch Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#181618] border border-white/10 p-8 sm:p-10 shadow-2xl">
          
          {/* Studio Location Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#4A0718] text-white text-[10px] font-mono uppercase tracking-wider font-bold mb-3">
                <span>HEADQUARTERS &amp; FLAGSHIP STUDIO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-headline text-white">
                VIJAYAWADA, ANDHRA PRADESH
              </h2>
              <p className="text-xs sm:text-sm text-[#C7BDB7] mt-2 leading-relaxed">
                Experience our heavyweight silhouettes, custom alterations, and archive collections at the flagship studio.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono text-[#C7BDB7]">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#4A0718] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold">{CONTACT_CONFIG.location.name}</div>
                  <div>{CONTACT_CONFIG.location.addressLine1}</div>
                  <div>{CONTACT_CONFIG.location.city}, {CONTACT_CONFIG.location.state} {CONTACT_CONFIG.location.pincode}</div>
                  <div className="text-emerald-400 text-[11px] mt-1">{CONTACT_CONFIG.location.coverage}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#4A0718] shrink-0" />
                <span>{CONTACT_CONFIG.location.hours}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#4A0718] shrink-0" />
                <a
                  href={CONTACT_CONFIG.email.mailto}
                  className="hover:text-white underline underline-offset-4 transition-colors"
                >
                  {CONTACT_CONFIG.email.address}
                </a>
              </div>
            </div>

            {/* Quick Action Matrix */}
            <div className="p-4 bg-[#111011] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold block">
                ORDER ASSISTANCE
              </span>
              <p className="text-[11px] text-[#C7BDB7] leading-relaxed">
                Already placed an order? Keep your 6-digit Order ID ready for expedited resolution on calls or WhatsApp.
              </p>
            </div>
          </div>

          {/* Dispatch Concierge Form */}
          <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
            <div className="mb-5">
              <span className="text-[11px] font-mono uppercase text-[#C7BDB7] tracking-widest block mb-1">
                Direct Message Portal
              </span>
              <h3 className="text-xl font-headline uppercase text-white font-black">
                SEND AN INQUIRY
              </h3>
            </div>

            {isSent ? (
              <div className="p-8 bg-[#4A0718]/30 border border-[#78132D] flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400" />
                <h4 className="text-lg font-headline uppercase text-white font-bold">
                  MESSAGE DISPATCHED
                </h4>
                <p className="text-xs text-[#C7BDB7] max-w-sm">
                  Our client specialist will review your inquiry and connect via email or WhatsApp within 24 hours.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-3 px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="arjun@example.com"
                      className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                    >
                      <option value="Product / Fit Inquiry">Product / Fit Inquiry</option>
                      <option value="Order Tracking & Dispatch">Order Tracking &amp; Dispatch</option>
                      <option value="Vijayawada Flagship Appointment">Vijayawada Flagship Appointment</option>
                      <option value="Size Exchange / Return">Size Exchange / Return</option>
                      <option value="Wholesale / Editorial Styling">Wholesale / Editorial Styling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Provide details on your inquiry or specific order requirements..."
                    className="w-full bg-[#111011] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white resize-none transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-[10px] font-mono text-[#C7BDB7]">
                    Encrypted transmission to SNAPSTER Concierge team.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg active:scale-95"
                  >
                    <Send size={13} />
                    <span>DISPATCH MESSAGE</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
