import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { siteConfig } from '../data/site';
import { Mail, MapPin, ArrowRight, CheckCircle2, Send, RefreshCw } from 'lucide-react';

const projectTypes = [
  'Website',
  'Product UI',
  'UX Redesign',
  'Landing Page',
  'Design System',
  'Frontend Web',
  'Other / Custom'
];

const projectStages = [
  'Idea / Concept',
  'Wireframes Ready',
  'Redesign of Live App',
  'Figma Ready for Code',
  'Existing Production System'
];

const budgetRanges = [
  '$5k — $10k',
  '$10k — $25k',
  '$25k — $50k',
  '$50k+'
];

const timelineRanges = [
  'Within 2–4 Weeks',
  '1–2 Months',
  '3+ Months',
  'Flexible / Ongoing'
];

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState(projectTypes[0]);
  const [selectedStage, setSelectedStage] = useState(projectStages[1]);
  const [selectedBudget, setSelectedBudget] = useState(budgetRanges[1]);
  const [selectedTimeline, setSelectedTimeline] = useState(timelineRanges[1]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Please enter a valid email address.';
    if (!message.trim() || message.trim().length < 10) newErrors.message = 'Please provide a brief message (min 10 chars).';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate clean frontend confirmation state
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                INITIATE A CONVERSATION
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">Q3 / Q4 2026</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              LET'S MAKE <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                something
              </span>{' '}
              <br />
              WORTH USING.
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              Have a digital product to design, a design system to architect, or a website to build? Send me a note below to start the conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10 items-start">
            
            {/* Left Column: Contact Dossier & Availability */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Availability Status Box */}
              <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CURRENT AVAILABILITY</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-mono">
                  {siteConfig.availability}
                </p>
              </div>

              {/* Direct Reach */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                  DIRECT CHANNELS
                </span>

                <div className="space-y-3">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="p-4 rounded-xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between group hover:border-[#FF3E00] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-[#FF3E00]" />
                      <div>
                        <div className="text-xs font-mono text-white/40">EMAIL</div>
                        <div className="text-sm font-mono text-white group-hover:text-[#FF3E00] transition-colors">
                          {siteConfig.email}
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

              {/* Social Channels */}
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

            {/* Right Column: Mini-Brief Form */}
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
                      className="space-y-8"
                    >
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                            YOUR NAME <span className="text-[#FF3E00]">*</span>
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alex Morgan"
                            className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border ${
                              errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                            } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors`}
                          />
                          {errors.name && (
                            <p className="text-[11px] font-mono text-red-400">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                            EMAIL ADDRESS <span className="text-[#FF3E00]">*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@company.com"
                            className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border ${
                              errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                            } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors`}
                          />
                          {errors.email && (
                            <p className="text-[11px] font-mono text-red-400">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Project Type Selector */}
                      <div className="space-y-3">
                        <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                          PROJECT TYPE
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {projectTypes.map((type) => (
                            <button
                              type="button"
                              key={type}
                              onClick={() => setSelectedType(type)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
                                selectedType === type
                                  ? 'bg-[#FF3E00] text-white font-bold shadow-md shadow-[#FF3E00]/20'
                                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Project Stage Selector */}
                      <div className="space-y-3">
                        <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                          CURRENT STAGE
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {projectStages.map((stage) => (
                            <button
                              type="button"
                              key={stage}
                              onClick={() => setSelectedStage(stage)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
                                selectedStage === stage
                                  ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {stage}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Budget & Timeline Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                            ESTIMATED BUDGET
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {budgetRanges.map((b) => (
                              <button
                                type="button"
                                key={b}
                                onClick={() => setSelectedBudget(b)}
                                className={`px-3 py-2 rounded-lg text-xs font-mono text-center transition-all ${
                                  selectedBudget === b
                                    ? 'bg-white text-black font-bold'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                            TARGET TIMELINE
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {timelineRanges.map((t) => (
                              <button
                                type="button"
                                key={t}
                                onClick={() => setSelectedTimeline(t)}
                                className={`px-3 py-2 rounded-lg text-xs font-mono text-center transition-all ${
                                  selectedTimeline === t
                                    ? 'bg-white text-black font-bold'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-white/70 block">
                          PROJECT CONTEXT & GOALS <span className="text-[#FF3E00]">*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Briefly describe your product goals, problem statements, or references..."
                          className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border ${
                            errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                          } text-white text-sm font-sans placeholder-white/20 focus:outline-none transition-colors resize-none`}
                        />
                        {errors.message && (
                          <p className="text-[11px] font-mono text-red-400">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        data-cursor="cta"
                        className="w-full py-4 rounded-xl bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#FF3E00]/20 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>TRANSMITTING INQUIRY...</span>
                          </>
                        ) : (
                          <>
                            <span>START A CONVERSATION</span>
                            <Send size={14} />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] font-mono text-white/40">
                        Typical response turnaround: within 24 hours (Mon—Fri).
                      </p>
                    </motion.form>
                  ) : (
                    /* Polished Success State */
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
                          TRANSMISSION CONFIRMED
                        </span>
                        <h3 className="text-3xl font-extrabold text-white tracking-tight">
                          MESSAGE RECEIVED.
                        </h3>
                        <p className="text-muted-primary text-sm max-w-md mx-auto">
                          Thank you, {name}. I will review your project requirements and get back to you at <span className="text-white font-mono">{email}</span> within 24 hours.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 max-w-md mx-auto text-xs font-mono text-white/70 text-left space-y-1">
                        <div><span className="text-white/40">Type:</span> {selectedType}</div>
                        <div><span className="text-white/40">Stage:</span> {selectedStage}</div>
                        <div><span className="text-white/40">Budget:</span> {selectedBudget}</div>
                        <div><span className="text-white/40">Timeline:</span> {selectedTimeline}</div>
                      </div>

                      <button
                        onClick={handleReset}
                        className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        SEND ANOTHER NOTE
                      </button>
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
