import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Send, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/site';
import { ThreeDCard } from '../ui/ThreeDCard';

const RECIPIENT_EMAIL = 'darshilbhuva4322@gmail.com';
const API_ENDPOINT = '/api/contact';

export const SpatialContact: React.FC = () => {
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

  // Dynamic mailto fallback preserving message inputs
  const mailtoFallbackUrl = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    const subject = trimmedName
      ? `Portfolio project inquiry from ${trimmedName}`
      : 'Portfolio project inquiry';

    const bodyParts: string[] = [];
    bodyParts.push(`Name: ${trimmedName || 'Visitor'}`);
    bodyParts.push(`Email: ${trimmedEmail || 'Not provided'}`);
    bodyParts.push(`\nMessage:\n${trimmedMsg || ''}`);

    const body = bodyParts.join('\n');
    return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [name, email, message]);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide your name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please provide a message.';
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
        // Fallback for non-json
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
      // Input strictly preserved in state
      if (err?.name === 'AbortError') {
        setSubmitError('Connection timed out. Please try again or open your email client.');
      } else {
        setSubmitError(err?.message || "Couldn't send the message.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <section id="spatial-contact" className="section-padding bg-[#050505] border-b border-white/10 relative overflow-hidden select-none">
      <div className="site-container">
        
        {/* Spatial Heading (As requested: LET'S MAKE SOMETHING GOOD.) */}
        <div className="mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-white/10">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-3 sm:mb-4">
            <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
              05
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">INITIATE COLLABORATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.92] mb-4 sm:mb-6 text-balance">
            LET'S MAKE <br />
            <span className="text-[#FF3E00]">SOMETHING GOOD.</span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm text-white/80 pt-2">
            <a
              href={`mailto:${RECIPIENT_EMAIL}`}
              className="text-white hover:text-[#FF3E00] transition-colors underline font-bold"
            >
              {RECIPIENT_EMAIL}
            </a>
            <span className="text-white/30">•</span>
            <span className="text-white/60">{siteConfig.location}</span>
          </div>
        </div>

        {/* Spatial Contact Stage: Direct Coordinate Cards (Left) + Tactile 3D Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Inquiries */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans">
              Have a digital product to architect, a UI/UX design project to discuss, or a web frontend to build? Send an inquiry directly.
            </p>

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                DIRECT CONTACT CHANNELS
              </span>

              <a
                href={`mailto:${RECIPIENT_EMAIL}`}
                className="p-4 rounded-2xl border border-white/10 bg-[#090909] flex items-center justify-between group hover:border-[#FF3E00] transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <Mail size={18} className="text-[#FF3E00] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-white/40">EMAIL</div>
                    <div className="text-sm font-mono text-white group-hover:text-[#FF3E00] transition-colors">
                      {RECIPIENT_EMAIL}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
              </a>

              <a
                href={siteConfig.phoneHref}
                className="p-4 rounded-2xl border border-white/10 bg-[#090909] flex items-center justify-between group hover:border-[#FF3E00] transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <Phone size={18} className="text-[#FF3E00] shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-white/40">PHONE</div>
                    <div className="text-sm font-mono text-white group-hover:text-[#FF3E00] transition-colors">
                      {siteConfig.formattedPhone}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
              </a>

              <div className="p-4 rounded-2xl border border-white/10 bg-[#090909] flex items-center space-x-3.5">
                <MapPin size={18} className="text-white/60 shrink-0" />
                <div>
                  <div className="text-[10px] font-mono text-white/40">LOCATION</div>
                  <div className="text-sm font-mono text-white">
                    {siteConfig.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Availability pill */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5 font-mono text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACCEPTING NEW WORK</span>
              </div>
              <p className="text-white/70">
                {siteConfig.availability}
              </p>
            </div>
          </div>

          {/* Right Column: 3D Form Card */}
          <div className="lg:col-span-7">
            <ThreeDCard maxRotation={4} depthZ={12} glareOpacity={0.12}>
              <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111] via-[#090909] to-[#060606] p-5 sm:p-8 lg:p-10 shadow-2xl relative [transform-style:preserve-3d]">
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="spatial-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-5 [transform-style:preserve-3d]"
                      noValidate
                    >
                      {/* Honeypot */}
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

                      {/* Error Banner with 1-Click Mailto Fallback */}
                      {submitError && (
                        <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                          <div className="flex items-center space-x-2 text-white/80">
                            <AlertCircle size={16} className="text-[#FF3E00] shrink-0" />
                            <div>
                              <span className="text-white font-bold mr-1">Couldn't deliver message:</span>
                              <span className="text-white/60">{submitError}</span>
                            </div>
                          </div>
                          <a
                            href={mailtoFallbackUrl}
                            className="inline-flex items-center space-x-1.5 text-[#FF3E00] hover:text-white font-bold transition-colors shrink-0 text-xs uppercase tracking-wider"
                          >
                            <span>Open Email Client</span>
                            <ArrowRight size={13} />
                          </a>
                        </div>
                      )}

                      {/* Name */}
                      <div style={{ transform: 'translateZ(20px)' }}>
                        <label htmlFor="spatial-name" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                          NAME <span className="text-[#FF3E00]">*</span>
                        </label>
                        <input
                          id="spatial-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          placeholder="Your Name"
                          disabled={isSubmitting}
                          autoComplete="name"
                          className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                            errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-base sm:text-sm font-sans placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50 min-h-[44px]`}
                        />
                        {errors.name && (
                          <p className="text-[11px] font-mono text-red-400 mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div style={{ transform: 'translateZ(20px)' }}>
                        <label htmlFor="spatial-email" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                          EMAIL <span className="text-[#FF3E00]">*</span>
                        </label>
                        <input
                          id="spatial-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder="your@email.com"
                          disabled={isSubmitting}
                          autoComplete="email"
                          className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                            errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-base sm:text-sm font-sans placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50 min-h-[44px]`}
                        />
                        {errors.email && (
                          <p className="text-[11px] font-mono text-red-400 mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div style={{ transform: 'translateZ(20px)' }}>
                        <label htmlFor="spatial-message" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                          MESSAGE <span className="text-[#FF3E00]">*</span>
                        </label>
                        <textarea
                          id="spatial-message"
                          rows={4}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            if (errors.message) setErrors({ ...errors, message: undefined });
                          }}
                          placeholder="Tell me about your project, goals, or requirements..."
                          disabled={isSubmitting}
                          className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                            errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-base sm:text-sm font-sans placeholder-white/20 focus:outline-none transition-colors resize-none disabled:opacity-50`}
                        />
                        {errors.message && (
                          <p className="text-[11px] font-mono text-red-400 mt-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <div style={{ transform: 'translateZ(30px)' }}>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-xl bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#FF3E00]/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>TRANSMITTING…</span>
                            </>
                          ) : (
                            <>
                              <span>SEND MESSAGE</span>
                              <Send size={14} />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-center text-[11px] font-mono text-white/40 pt-1">
                        Directly delivered to {RECIPIENT_EMAIL}.
                      </p>
                    </motion.form>
                  ) : (
                    /* Success state */
                    <motion.div
                      key="spatial-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center space-y-5"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle2 size={30} />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                          TRANSMISSION CONFIRMED
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          THANK YOU.
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                          {submittedName ? `Thank you, ${submittedName}. ` : 'Thank you. '}
                          Your inquiry has been delivered to <span className="text-white font-mono">{RECIPIENT_EMAIL}</span>. I will follow up shortly.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleReset}
                          className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[44px]"
                        >
                          TRANSMIT ANOTHER MESSAGE
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </ThreeDCard>
          </div>

        </div>

      </div>
    </section>
  );
};
