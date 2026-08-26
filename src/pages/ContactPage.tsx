import React, { useState } from 'react';
import { siteMetadata } from '../data/navigation';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

const projectTypes = [
  'Product Design / UX',
  'Web Design',
  'Frontend Web Development',
  'Design System Architecture',
  'Other / Consultation'
];

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState(projectTypes[0]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Please enter a valid email address.';
    if (!message.trim() || message.trim().length < 10) newErrors.message = 'Please provide a brief message (min 10 characters).';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 space-y-16">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
          Have an upcoming product to design, a design system to build, or a website to code? Tell me about your goals and timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pt-4 border-t border-white/10">
        
        {/* Left Column: Direct Info */}
        <div className="md:col-span-5 space-y-6 text-xs font-mono text-neutral-400">
          <div className="space-y-1">
            <div className="text-white font-bold uppercase">Direct Email</div>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="text-neutral-300 hover:text-[#FF3E00] transition-colors block text-sm font-sans"
            >
              {siteMetadata.email}
            </a>
          </div>

          <div className="space-y-1">
            <div className="text-white font-bold uppercase">Location</div>
            <p className="text-neutral-300 text-sm font-sans">{siteMetadata.location}</p>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="text-white font-bold uppercase">Profiles</div>
            <ul className="space-y-1 text-neutral-400">
              {siteMetadata.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {s.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-400 block">
                  Name <span className="text-[#FF3E00]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={`w-full px-3.5 py-2.5 rounded bg-[#0A0A0A] border ${
                    errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                  } text-white text-sm focus:outline-none transition-colors`}
                />
                {errors.name && <p className="text-[11px] font-mono text-red-400">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-400 block">
                  Email Address <span className="text-[#FF3E00]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full px-3.5 py-2.5 rounded bg-[#0A0A0A] border ${
                    errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                  } text-white text-sm focus:outline-none transition-colors`}
                />
                {errors.email && <p className="text-[11px] font-mono text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-400 block">
                  Project Focus
                </label>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                        selectedType === type
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-neutral-400 block">
                  Message <span className="text-[#FF3E00]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly outline your project requirements, scope, or timeline..."
                  className={`w-full px-3.5 py-2.5 rounded bg-[#0A0A0A] border ${
                    errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#FF3E00]'
                  } text-white text-sm focus:outline-none transition-colors resize-none`}
                />
                {errors.message && <p className="text-[11px] font-mono text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#FF3E00] hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Transmitting...' : 'Send Message →'}</span>
              </button>

            </form>
          ) : (
            <div className="p-8 rounded border border-white/10 bg-[#0A0A0A] space-y-4 text-center">
              <CheckCircle2 size={28} className="text-[#FF3E00] mx-auto" />
              <h2 className="text-xl font-bold text-white">Message Received</h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
                Thank you, {name}. I'll review your inquiry and get back to you at {email} within 24 hours.
              </p>
              <button
                onClick={handleReset}
                className="text-xs font-mono text-neutral-400 hover:text-white underline pt-2"
              >
                Send another message
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
