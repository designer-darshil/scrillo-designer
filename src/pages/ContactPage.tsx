import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { siteConfig } from '../data/site';
import { Mail, MapPin, ArrowRight, CheckCircle2, Send, RefreshCw, AlertCircle } from 'lucide-react';

const RECIPIENT_EMAIL = 'darshilbhuva4322@gmail.com';
const SUBMISSION_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = 'Please enter a message (at least 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(SUBMISSION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `New Portfolio Inquiry from ${name.trim()}`,
          _template: 'table'
        })
      });

      const data = await response.json();

      if (response.ok && data.success !== 'false') {
        setSubmittedName(name.trim());
        setIsSubmitted(true);
        // Reset form inputs only after successful submission
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});
      } else {
        throw new Error(data.message || 'Delivery request was not accepted.');
      }
    } catch (err) {
      setSubmitError(
        `Unable to deliver message right now. Please try again or email me directly at ${RECIPIENT_EMAIL}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                CONTACT
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">GET IN TOUCH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.95] sm:leading-[0.92] mb-8 break-words">
              LET'S START A <br />
              <span className="italic font-light text-[#FF3E00] tracking-tight lowercase text-[0.88em] sm:text-[0.92em] block my-1 sm:my-2">
                conversation.
              </span>
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              Have a digital product to design, a design system to architect, or a website to build? Send me a message below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10 items-start">
            
            {/* Left Column: Direct Channels & Information */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Availability Status */}
              <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CURRENT AVAILABILITY</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-mono">
                  {siteConfig.availability}
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                  DIRECT CHANNELS
                </span>

                <div className="space-y-3">
                  <a
                    href={`mailto:${RECIPIENT_EMAIL}`}
                    className="p-4 rounded-xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between group hover:border-[#FF3E00] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-[#FF3E00]" />
                      <div>
                        <div className="text-xs font-mono text-white/40">EMAIL</div>
                        <div className="text-sm font-mono text-white group-hover:text-[#FF3E00] transition-colors">
                          {RECIPIENT_EMAIL}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors" />
                  </a>

                  <div className="p-4 rounded-xl border border-white/10 bg-[#0C0C0C] flex items-center space-x-3">
                    <MapPin size={16} className="text-white/60" />
                    <div>
                      <div className="text-xs font-mono text-white/40">LOCATION</div>
                      <div className="text-sm font-mono text-white">
                        {siteConfig.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
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
                      className="p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:text-[#FF3E00] text-white/70 transition-colors uppercase truncate"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Essential Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl relative">
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      noValidate
                    >
                      {/* Optional Server/Network Error Notification */}
                      {submitError && (
                        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 flex items-start space-x-3 text-red-300 text-xs font-mono leading-relaxed">
                          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p>{submitError}</p>
                            <a
                              href={`mailto:${RECIPIENT_EMAIL}`}
                              className="underline text-white hover:text-[#FF3E00] mt-1 inline-block"
                            >
                              Click here to open email client →
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Name Field */}
                      <div className="space-y-2">
                        <label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-white/70 block">
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
                          className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border ${
                            errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50`}
                        />
                        {errors.name && (
                          <p className="text-[11px] font-mono text-red-400">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-white/70 block">
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
                          className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border ${
                            errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors disabled:opacity-50`}
                        />
                        {errors.email && (
                          <p className="text-[11px] font-mono text-red-400">{errors.email}</p>
                        )}
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                          MESSAGE <span className="text-[#FF3E00]">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            if (errors.message) setErrors({ ...errors, message: undefined });
                          }}
                          placeholder="Describe your project, goals, or what you'd like to collaborate on..."
                          disabled={isSubmitting}
                          className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border ${
                            errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors resize-none disabled:opacity-50`}
                        />
                        {errors.message && (
                          <p className="text-[11px] font-mono text-red-400">{errors.message}</p>
                        )}
                      </div>

                      {/* Send Message Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        data-cursor="cta"
                        className="w-full py-4 rounded-xl bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#FF3E00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>SENDING MESSAGE...</span>
                          </>
                        ) : (
                          <>
                            <span>SEND MESSAGE</span>
                            <Send size={14} />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] font-mono text-white/40">
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
                      className="py-12 text-center space-y-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle2 size={32} />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                          MESSAGE DELIVERED
                        </span>
                        <h3 className="text-3xl font-extrabold text-white tracking-tight">
                          THANK YOU.
                        </h3>
                        <p className="text-muted-primary text-sm max-w-md mx-auto">
                          {submittedName ? `Thank you, ${submittedName}. ` : 'Thank you. '}
                          Your message has been successfully delivered to <span className="text-white font-mono">{RECIPIENT_EMAIL}</span>. I will get back to you shortly.
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleReset}
                          className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
