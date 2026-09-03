import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { siteConfig } from '../data/site';
import { Mail, Phone, MapPin, ArrowRight, ArrowUpRight, CheckCircle2, Send, RefreshCw, AlertCircle } from 'lucide-react';

const RECIPIENT_EMAIL = 'darshilbhuva4322@gmail.com';
const API_ENDPOINT = '/api/contact';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  // Dynamic mailto link carrying the visitor's current inputs
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

    const body = bodyParts.join('\n');
    return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

    if (!validate()) {
      return;
    }

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

      // Success flow: record name, mark submitted, reset form fields
      setSubmittedName(name.trim());
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setHoneypot('');
      setSubmitError(null);
    } catch (err: any) {
      clearTimeout(timeoutId);
      // Failure flow: form data (name, email, message) is strictly preserved!
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

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-3 sm:mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                CONTACT
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">GET IN TOUCH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[1.0] sm:leading-[0.95] mb-4 sm:mb-6 break-words">
              LET'S START A <br />
              <span className="italic font-light text-[#FF3E00] tracking-tight lowercase text-[0.88em] sm:text-[0.92em] block my-0.5 sm:my-1">
                conversation.
              </span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base md:text-lg text-muted-primary leading-relaxed">
              Have a digital product to design, a UI/UX project to discuss, or a website to build? Send me a message below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6 sm:pt-8 border-t border-white/10 items-start">
            
            {/* Left Column: Context & Contact Metadata */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              
              {/* Availability Notice */}
              <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#0C0C0C] space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACCEPTING NEW WORK</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-mono">
                  {siteConfig.availability}
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                  DIRECT CHANNELS
                </span>

                <div className="space-y-2.5">
                  <a
                    href={`mailto:${RECIPIENT_EMAIL}`}
                    className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between group hover:border-[#FF3E00] transition-colors min-h-[52px]"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-[#FF3E00] shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono text-white/40">EMAIL</div>
                        <div className="text-xs sm:text-sm font-mono text-white group-hover:text-[#FF3E00] transition-colors">
                          {RECIPIENT_EMAIL}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
                  </a>

                  <a
                    href={siteConfig.phoneHref}
                    className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between group hover:border-[#FF3E00] transition-colors min-h-[52px]"
                  >
                    <div className="flex items-center space-x-3">
                      <Phone size={16} className="text-[#FF3E00] shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono text-white/40">PHONE</div>
                        <div className="text-xs sm:text-sm font-mono text-white group-hover:text-[#FF3E00] transition-colors">
                          {siteConfig.formattedPhone}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
                  </a>

                  <div className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-[#0C0C0C] flex items-center space-x-3 min-h-[52px]">
                    <MapPin size={16} className="text-white/60 shrink-0" />
                    <div>
                      <div className="text-[11px] font-mono text-white/40">LOCATION</div>
                      <div className="text-xs sm:text-sm font-mono text-white">
                        {siteConfig.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Network Profiles (Resume-supported only: LinkedIn, Dribbble, Behance, Instagram) */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                  NETWORK PROFILES
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(siteConfig.socials).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 sm:p-3.5 rounded-xl border border-white/10 bg-[#0C0C0C] hover:border-[#FF3E00] hover:text-[#FF3E00] text-white/80 transition-colors flex items-center justify-between group min-h-[48px]"
                    >
                      <span className="capitalize">{key}</span>
                      <ArrowUpRight size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl relative">
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-5"
                      noValidate
                    >
                      {/* Honeypot anti-spam field (hidden from genuine users) */}
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

                      {/* Compact Error Banner with 1-Click Mailto Action */}
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

                      {/* Name Field */}
                      <div>
                        <label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                          NAME <span className="text-[#FF3E00]">*</span>
                        </label>
                        <input
                          id="contact-name"
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

                      {/* Email Field */}
                      <div>
                        <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                          EMAIL <span className="text-[#FF3E00]">*</span>
                        </label>
                        <input
                          id="contact-email"
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

                      {/* Message Field */}
                      <div>
                        <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-white/70 block mb-1.5">
                          MESSAGE <span className="text-[#FF3E00]">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            if (errors.message) setErrors({ ...errors, message: undefined });
                          }}
                          placeholder="Describe your project, goals, or what you'd like to collaborate on..."
                          disabled={isSubmitting}
                          className={`w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl bg-black/60 border ${
                            errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors resize-none disabled:opacity-50`}
                        />
                        {errors.message && (
                          <p className="text-[11px] font-mono text-red-400 mt-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Send Message Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        data-cursor="cta"
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
                        Messages are delivered directly to {RECIPIENT_EMAIL}.
                      </p>
                    </motion.form>
                  ) : (
                    /* Clean Success State */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-8 sm:py-12 text-center space-y-5 sm:space-y-6"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
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
                          Your message has been sent to <span className="text-white font-mono">{RECIPIENT_EMAIL}</span>. I will get back to you shortly.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleReset}
                          className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[44px]"
                        >
                          SEND ANOTHER MESSAGE
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};
