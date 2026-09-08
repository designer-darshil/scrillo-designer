import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, ArrowUpRight, Mail } from 'lucide-react';

const RECIPIENT_EMAIL = 'darshilbhuva4322@gmail.com';
const API_ENDPOINT = '/api/contact';

export const EditorialContact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  // Dynamic mailto link carrying current visitor input as a rock-solid fallback
  const mailtoFallbackUrl = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    const subject = trimmedName
      ? `Project Inquiry from ${trimmedName}`
      : 'Project Inquiry';

    const bodyLines = [
      `Name: ${trimmedName || 'Visitor'}`,
      `Email: ${trimmedEmail || 'Not specified'}`,
      '',
      'Message:',
      trimmedMsg || ''
    ];

    return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
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
      newErrors.email = 'Please enter your email.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
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
        throw new Error(data.error || 'Server could not accept message.');
      }

      // Success
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      clearTimeout(timeoutId);
      // Preserves all entered form inputs!
      const errorMsg =
        err?.name === 'AbortError'
          ? 'Request timed out after 10 seconds.'
          : err?.message || 'Failed to send via server.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-[#060606] text-white">
      {/* Header Bar */}
      <div className="border-b border-white/[0.08] py-8 sm:py-10">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest uppercase text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">05</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00]">INQUIRY & CONTACT</span>
          </div>
          <div>
            <span>SURAT, GUJARAT, INDIA</span>
          </div>
        </div>
      </div>

      {/* Main Editorial Spread */}
      <div className="site-container py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Bold Editorial Headline */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <h2 className="clamp-spread-title font-extrabold uppercase tracking-tight text-white editorial-title">
              LET'S WORK <br />
              <span className="text-[#FF3E00]">TOGETHER.</span>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed text-pretty max-w-md">
              Have a web design, UI/UX system, or application interface to build? Send an inquiry or connect directly via email.
            </p>

            <div className="pt-6 border-t border-white/[0.08] space-y-3 font-mono text-xs">
              <div>
                <span className="block text-white/30 uppercase text-[10px] mb-1">DIRECT INBOX</span>
                <a
                  href={`mailto:${RECIPIENT_EMAIL}`}
                  className="text-white/90 hover:text-[#FF3E00] transition-colors flex items-center gap-1.5 text-sm"
                >
                  <Mail size={14} className="text-[#FF3E00]" />
                  <span>{RECIPIENT_EMAIL}</span>
                </a>
              </div>
              <div className="text-white/40 pt-1">
                Typical response window: within 24 hours.
              </div>
            </div>
          </div>

          {/* Right Column: Highly Usable Minimal Form */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-lg border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-10 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                      MESSAGE TRANSMITTED
                    </h3>
                    <p className="text-white/70 text-sm max-w-sm mx-auto">
                      Thank you for reaching out. Your message was successfully received and I will reply shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-5 py-2 rounded border border-white/20 text-xs font-mono tracking-widest uppercase text-white hover:bg-white/5 transition-colors"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Anti-bot honeypot */}
                    <input
                      type="text"
                      name="_gotcha"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* NAME */}
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block font-mono text-xs uppercase tracking-widest text-white/60">
                        NAME <span className="text-[#FF3E00]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Your name or company"
                        className={`w-full px-4 py-3 rounded bg-black/60 border text-white placeholder-white/20 text-sm focus:outline-none transition-colors ${
                          errors.name ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                        }`}
                      />
                      {errors.name && (
                        <p className="font-mono text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block font-mono text-xs uppercase tracking-widest text-white/60">
                        EMAIL <span className="text-[#FF3E00]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-3 rounded bg-black/60 border text-white placeholder-white/20 text-sm focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                        }`}
                      />
                      {errors.email && (
                        <p className="font-mono text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* MESSAGE */}
                    <div className="space-y-2">
                      <label htmlFor="contact-message" className="block font-mono text-xs uppercase tracking-widest text-white/60">
                        MESSAGE <span className="text-[#FF3E00]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                        }}
                        placeholder="Brief overview of your project, goals, or timeline..."
                        className={`w-full px-4 py-3 rounded bg-black/60 border text-white placeholder-white/20 text-sm focus:outline-none transition-colors resize-none ${
                          errors.message ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                        }`}
                      />
                      {errors.message && (
                        <p className="font-mono text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* ERROR & FALLBACK BAR */}
                    {submitError && (
                      <div className="p-4 rounded border border-red-500/30 bg-red-500/10 space-y-3">
                        <div className="flex items-start gap-2.5 text-red-400 text-xs font-mono">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>{submitError} (Your entered details are preserved below).</span>
                        </div>
                        <div>
                          <a
                            href={mailtoFallbackUrl}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                          >
                            <span>Open Email Client</span>
                            <ArrowUpRight size={13} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded bg-[#FF3E00] hover:bg-white hover:text-black text-white font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF3E00]/10"
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING INQUIRY...</span>
                      ) : (
                        <>
                          <span>SEND INQUIRY</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
