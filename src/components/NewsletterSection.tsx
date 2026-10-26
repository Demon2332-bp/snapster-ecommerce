import React, { useState } from 'react';
import { Instagram, Youtube, Twitter, Globe, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SnapsterLogo } from './SnapsterLogo';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Realistic API interaction with latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      showToast('Welcome to the SNAPSTER Inner Circle. Exclusive drop access confirmed.', 'success');
    }, 900);
  };

  return (
    <section className="relative w-full bg-[#111011] text-[#F6F1E9] py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
      {/* Background Graphic & Mood Lighting */}
      <div className="absolute inset-0 bg-radial from-[#4A0718]/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Brand & Copy */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-left">
            <SnapsterLogo size="lg" variant="light" />
            
            <div className="sm:border-l sm:border-white/15 sm:pl-6 space-y-1">
              <h3 className="text-xl sm:text-2xl font-black uppercase font-headline tracking-wider text-white">
                STAY AHEAD.
              </h3>
              <p className="text-xs sm:text-sm text-[#C7BDB7] max-w-md">
                Get exclusive drops, private sale invitations, and style releases before public launch.
              </p>
            </div>
          </div>

          {/* Right Newsletter Input & Socials */}
          <div className="w-full lg:w-auto flex-1 max-w-xl">
            {isSubscribed ? (
              <div className="p-4 bg-[#4A0718]/40 border border-[#78132D] flex items-center gap-3 text-white">
                <CheckCircle2 size={20} className="text-[#C7BDB7] shrink-0" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">You are now on the VIP roster.</span> Watch your inbox for secret code{' '}
                  <span className="font-mono font-bold text-white bg-black/40 px-1.5 py-0.5">EDGE20</span> for 20% off your first drop.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Enter your email address"
                      disabled={isSubmitting}
                      className="w-full bg-[#1D1B1C] border border-white/20 focus:border-white text-white placeholder-[#C7BDB7]/60 text-xs sm:text-sm px-4 py-3 sm:py-3.5 focus:outline-none transition-colors"
                      aria-label="Email address for newsletter"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 sm:py-3.5 bg-[#4A0718] hover:bg-[#650D24] text-white font-extrabold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBSCRIBE</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-400 font-mono tracking-wide">{errorMessage}</p>
                )}
              </form>
            )}

            {/* Social Channels Icons (From Mockup) */}
            <div className="mt-4 flex items-center gap-4 text-[#C7BDB7] text-xs">
              <span className="text-[10px] font-mono tracking-widest uppercase">Follow:</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://snapster.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="SNAPSTER World"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
