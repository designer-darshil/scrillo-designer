import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { siteConfig } from '../../data/site';

const RECIPIENT_EMAIL = 'darshilbhuva4322@gmail.com';
const API_ENDPOINT = '/api/contact';

export const CinematicClosing: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const mailtoFallbackUrl = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    const subject = trimmedName
      ? `New portfolio inquiry from ${trimmedName}`
      : 'New portfolio inquiry';

    const bodyParts: string[] = [];
    bodyParts.push(`Name: ${trimmedName || 'Visitor'}`);
    bodyParts.push(`Email: ${trimmedEmail || 'Not provided'}`);
    bodyParts.push(`\nMessage:\n${trimmedMsg || ''}`);

    return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyParts.join('\n'))}`;
  }, [name, email, message]);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter a message.';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _gotcha: honeypot
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Couldn't send the message.");
      }

      setSubmittedName(name.trim());
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setHoneypot('');
      setSubmitError(null);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === 'AbortError') {
        setSubmitError("Request timed out. Please try again, or open your email client to contact me directly.");
      } else {
        setSubmitError(err?.message || "Couldn't send the message.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cinematic-contact" className="py-24 sm:py-32 md:py-44 bg-[#050505] relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#FF3E00]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Act 04 Scene Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-8 sm:mb-12">
          <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            ACT 04
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">EPILOGUE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Giant Typographic Call */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              LET'S WORK <br />
              <span className="italic font-light text-[#FF3E00] lowercase">together.</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-primary leading-relaxed max-w-md">
              Available for select UI/UX design, web design, and frontend implementation engagements. Let's discuss your product.
            </p>

            {/* Direct Coordinates */}
            <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
              <a
                href={`mailto:${RECIPIENT_EMAIL}`}
                className="flex items-center space-x-3 p-3.5 rounded-xl border border-white/10 bg-[#0C0C0C] hover:border-[#FF3E00] text-white transition-colors"
              >
                <Mail size={15} className="text-[#FF3E00] shrink-0" />
                <span className="truncate">{RECIPIENT_EMAIL}</span>
              </a>

              <a
                href={siteConfig.phoneHref}
                className="flex items-center space-x-3 p-3.5 rounded-xl border border-white/10 bg-[#0C0C0C] hover:border-[#FF3E00] text-white transition-colors"
              >
                <Phone size={15} className="text-[#FF3E00] shrink-0" />
                <span>{siteConfig.formattedPhone}</span>
              </a>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-white/10 bg-[#0C0C0C] text-white/70">
                <MapPin size={15} className="text-white/50 shrink-0" />
                <span>{siteConfig.location}</span>
              </div>
            </div>
          </div>

          {/* Right: Working Fallback-Guarded Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                    <input
                      type="text"
                      name="_gotcha"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      className="sr-only"
                      aria-hidden="true"
                    />

                    {/* Compact Fallback Error Banner */}
                    {submitError && (
                      <div className="p-3 sm:p-3.5 rounded-xl border border-white/15 bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center space-x-2 text-white/80">
                          <AlertCircle size={15} className="text-[#FF3E00] shrink-0" />
                          <div>
                            <span className="text-white font-bold mr-1">Couldn't send the message</span>
                            <span className="text-white/60 block sm:inline">Please try again, or open your email client to contact me directly.</span>
                          </div>
                        </div>
                        <a
                          href={mailtoFallbackUrl}
                          className="inline-flex items-center space-x-1.5 text-[#FF3E00] hover:text-white font-bold transition-colors shrink-0 text-xs uppercase tracking-wider min-h-[36px]"
                        >
                          <span>Open Email Client</span>
                          <ArrowRight size={13} />
                        </a>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label htmlFor="cinematic-name" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                        NAME <span className="text-[#FF3E00]">*</span>
                      </label>
                      <input
                        id="cinematic-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Your Name"
                        disabled={isSubmitting}
                        autoComplete="name"
                        className={`w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl bg-black/60 border ${
                          errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                        } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50 min-h-[44px]`}
                      />
                      {errors.name && (
                        <p className="text-[11px] font-mono text-red-400 mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="cinematic-email" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                        EMAIL <span className="text-[#FF3E00]">*</span>
                      </label>
                      <input
                        id="cinematic-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        autoComplete="email"
                        className={`w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl bg-black/60 border ${
                          errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                        } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50 min-h-[44px]`}
                      />
                      {errors.email && (
                        <p className="text-[11px] font-mono text-red-400 mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="cinematic-message" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                        MESSAGE <span className="text-[#FF3E00]">*</span>
                      </label>
                      <textarea
                        id="cinematic-message"
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="Tell me about your project or idea..."
                        disabled={isSubmitting}
                        className={`w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl bg-black/60 border ${
                          errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                        } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors resize-none disabled:opacity-50`}
                      />
                      {errors.message && (
                        <p className="text-[11px] font-mono text-red-400 mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#FF3E00]/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>SENDING…</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] font-mono text-white/40 pt-1">
                      Directly received at {RECIPIENT_EMAIL}.
                    </p>
                  </form>
                ) : (
                  <div className="py-8 sm:py-12 text-center space-y-5">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 size={28} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                        MESSAGE SENT
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        THANK YOU.
                      </h3>
                      <p className="text-muted-primary text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                        {submittedName ? `Thank you, ${submittedName}. ` : 'Thank you. '}
                        Your message has been sent to <span className="text-white font-mono">{RECIPIENT_EMAIL}</span>.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setSubmitError(null);
                        }}
                        className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[44px]"
                      >
                        SEND ANOTHER MESSAGE
                      </button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
