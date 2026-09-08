import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Wrench,
  ExternalLink,
  Edit3,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Globe,
  Linkedin,
  Dribbble,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';

/* ── Completeness helpers ──────────────────────── */

interface CompletenessItem {
  label: string;
  status: 'Complete' | 'Partial' | 'Missing';
}

function profileCompleteness(data: any): CompletenessItem[] {
  const p = data.profile || {};
  const items: CompletenessItem[] = [];

  // Profile information
  const profileFields = [p.name, p.title, p.primaryDescription, p.objective, p.location];
  const profileFilled = profileFields.filter(Boolean).length;
  items.push({
    label: 'Profile information',
    status: profileFilled === profileFields.length ? 'Complete' : profileFilled > 0 ? 'Partial' : 'Missing',
  });

  // Contact information
  const contactFields = [p.email, p.phone, p.address];
  const contactFilled = contactFields.filter(Boolean).length;
  items.push({
    label: 'Contact information',
    status: contactFilled === contactFields.length ? 'Complete' : contactFilled > 0 ? 'Partial' : 'Missing',
  });

  // Experience
  const exp = data.experience || [];
  items.push({
    label: 'Experience',
    status: exp.length >= 4 ? 'Complete' : exp.length > 0 ? 'Partial' : 'Missing',
  });

  // Education
  const edu = data.education || [];
  items.push({
    label: 'Education',
    status: edu.length >= 3 ? 'Complete' : edu.length > 0 ? 'Partial' : 'Missing',
  });

  // Skills
  const skills = data.skills || [];
  items.push({
    label: 'Skills',
    status: skills.length >= 3 ? 'Complete' : skills.length > 0 ? 'Partial' : 'Missing',
  });

  // Social links
  const socials = [p.linkedinUrl, p.dribbbleUrl, p.behanceUrl, p.instagramUrl].filter(Boolean);
  const realSocials = socials.filter((s: string) => !s.match(/^https?:\/\/(dribbble|behance|instagram)\.(com|net)\/?$/));
  items.push({
    label: 'Social links',
    status: realSocials.length >= 4 ? 'Complete' : realSocials.length > 0 ? 'Partial' : 'Missing',
  });

  // Profile image
  items.push({
    label: 'Profile image',
    status: p.profileImage ? 'Complete' : 'Missing',
  });

  return items;
}

/* ── Status badge ──────────────────────────────── */

const StatusBadge: React.FC<{ status: 'Complete' | 'Partial' | 'Missing' }> = ({ status }) => {
  const config = {
    Complete: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
    Partial: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertCircle },
    Missing: { color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
  }[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

/* ── Stat card ─────────────────────────────────── */

const StatCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  href: string;
}> = ({ icon: Icon, label, value, href }) => (
  <Link
    to={href}
    className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
    style={{ textDecoration: 'none' }}
  >
    <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-[var(--color-muted)]" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-[var(--color-muted)] tracking-wider uppercase">{label}</div>
      <div className="text-lg font-semibold text-[var(--color-text)]">{value}</div>
    </div>
    <ChevronRight className="w-4 h-4 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
);

/* ── Social link row ───────────────────────────── */

const SocialRow: React.FC<{ platform: string; url?: string }> = ({ platform, url }) => {
  const isPlaceholder = !url || /^https?:\/\/(dribbble|behance|instagram)\.(com|net)\/?$/.test(url);
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LinkedIn: Linkedin,
    Dribbble: Dribbble,
    Behance: Globe,
    Instagram: Globe,
  };
  const Icon = iconMap[platform] || Globe;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-b-0">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[var(--color-muted)]" />
        <span className="text-sm text-[var(--color-text)]">{platform}</span>
      </div>
      {isPlaceholder ? (
        <span className="text-xs text-[var(--color-muted)] italic">Not set</span>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          View <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

/* ── Quick action button ───────────────────────── */

const QuickAction: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}> = ({ icon: Icon, label, href }) => (
  <Link
    to={href}
    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 text-sm text-[var(--color-text)]"
    style={{ textDecoration: 'none' }}
  >
    <Icon className="w-4 h-4 text-[var(--color-muted)]" />
    <span className="flex-1">{label}</span>
    <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
  </Link>
);

/* ── Main component ────────────────────────────── */

export const ProfileOverview: React.FC = () => {
  const { data } = useWebsiteData();
  const profile = data.profile || ({} as any);
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const tools = data.tools || [];
  const completeness = profileCompleteness(data);

  const completeCount = completeness.filter((c) => c.status === 'Complete').length;
  const totalCount = completeness.length;
  const completionPercent = Math.round((completeCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Header ──────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Profile</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Overview of your profile information sourced from Resume.pdf
        </p>
      </div>

      {/* ── Profile Identity Card ───────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="p-6 flex items-start gap-6">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-xl bg-white/[0.06] border border-white/[0.08] overflow-hidden shrink-0">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-[var(--color-muted)]" />
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {profile.name || 'Name not set'}
            </h2>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">
              {profile.title || 'Title not set'}
            </p>

            {/* Contact quick info */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
              {profile.email && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                  <Mail className="w-3 h-3" /> {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                  <Phone className="w-3 h-3" /> {profile.phone}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                  <MapPin className="w-3 h-3" /> {profile.location}
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-sm text-[var(--color-text)] transition-colors"
            style={{ textDecoration: 'none' }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Briefcase} label="Experience" value={`${experience.length} positions`} href="/admin/content" />
        <StatCard icon={GraduationCap} label="Education" value={`${education.length} entries`} href="/admin/content" />
        <StatCard icon={Sparkles} label="Skills" value={`${skills.reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0)} items`} href="/admin/skills" />
        <StatCard icon={Wrench} label="Tools" value={`${tools.length} tools`} href="/admin/skills" />
      </div>

      {/* ── Two column layout ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Social Links */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-wider uppercase">
              Social Links
            </h3>
            <Link
              to="/admin/content"
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Edit
            </Link>
          </div>
          <div>
            <SocialRow platform="LinkedIn" url={profile.linkedinUrl} />
            <SocialRow platform="Dribbble" url={profile.dribbbleUrl} />
            <SocialRow platform="Behance" url={profile.behanceUrl} />
            <SocialRow platform="Instagram" url={profile.instagramUrl} />
          </div>
        </div>

        {/* Right: Profile Image Preview */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-wider uppercase">
              Profile Image
            </h3>
            <Link
              to="/admin/media"
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Change
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--color-muted)]">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content Completeness ────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-wider uppercase">
            Content Completeness
          </h3>
          <span className="text-xs text-[var(--color-muted)]">
            {completionPercent}% complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-white/[0.06] mb-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completionPercent}%`,
              background: completionPercent === 100
                ? 'linear-gradient(90deg, #34d399, #10b981)'
                : completionPercent >= 70
                  ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                  : 'linear-gradient(90deg, #f87171, #ef4444)',
            }}
          />
        </div>

        {/* Items list */}
        <div className="space-y-2.5">
          {completeness.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-[var(--color-text)]">{item.label}</span>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-wider uppercase mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <QuickAction icon={Edit3} label="Edit Profile" href="/admin/content" />
          <QuickAction icon={Briefcase} label="Edit Experience" href="/admin/content" />
          <QuickAction icon={GraduationCap} label="Edit Education" href="/admin/content" />
          <QuickAction icon={Sparkles} label="Edit Skills" href="/admin/skills" />
          <QuickAction icon={Globe} label="Edit Social Links" href="/admin/content" />
          <QuickAction icon={ImageIcon} label="Change Profile Image" href="/admin/media" />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
