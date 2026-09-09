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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Avatar,
} from '../../design-system';

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
  const variant = status === 'Complete' ? 'success' : status === 'Partial' ? 'warning' : 'error';
  return (
    <Badge variant={variant} dot>
      {status}
    </Badge>
  );
};

/* ── Stat card ─────────────────────────────────── */

const StatCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  href: string;
}> = ({ icon: Icon, label, value, href }) => (
  <Link to={href} className="no-underline block">
    <Card className="p-4 flex items-center gap-4 hover:border-[var(--color-border-strong)] transition-all group shadow-xs">
      <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted tracking-wider uppercase font-mono">{label}</div>
        <div className="text-lg font-semibold text-foreground">{value}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
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
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-muted" />
        <span className="text-sm text-foreground">{platform}</span>
      </div>
      {isPlaceholder ? (
        <span className="text-xs text-muted italic">Not configured</span>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground hover:underline flex items-center gap-1 font-mono"
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
  <Link to={href} className="no-underline block">
    <Card className="flex items-center gap-3 px-4 py-3 hover:border-[var(--color-border-strong)] transition-all text-sm text-foreground group shadow-xs">
      <Icon className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform" />
    </Card>
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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Profile & Identity</h1>
        <p className="text-sm text-muted mt-1">
          Overview of your career profile, contact endpoints, and capabilities architecture.
        </p>
      </div>

      {/* ── Profile Identity Card ───────────────── */}
      <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 shadow-xs">
        {/* Profile Avatar */}
        <Avatar
          src={profile.profileImage}
          alt={profile.name || 'Profile'}
          name={profile.name || 'User'}
          size="xl"
          className="shrink-0"
        />

        {/* Name & Title */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {profile.name || 'Name not set'}
              </h2>
              <p className="text-sm text-muted mt-0.5 font-mono">
                {profile.title || 'Title not set'}
              </p>
            </div>

            <Link to="/admin/content" className="no-underline">
              <Button
                variant="secondary"
                icon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Contact quick info */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 pt-4 border-t border-border">
            {profile.email && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Mail className="w-3.5 h-3.5 text-foreground" /> {profile.email}
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Phone className="w-3.5 h-3.5 text-foreground" /> {profile.phone}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 text-foreground" /> {profile.location}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* ── Stats Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Briefcase} label="Experience" value={`${experience.length} positions`} href="/admin/content" />
        <StatCard icon={GraduationCap} label="Education" value={`${education.length} entries`} href="/admin/content" />
        <StatCard icon={Sparkles} label="Skills" value={`${skills.reduce((acc: number, s: any) => acc + (s.items?.length || s.skills?.length || 0), 0)} items`} href="/admin/skills" />
        <StatCard icon={Wrench} label="Tools" value={`${tools.length} tools`} href="/admin/content" />
      </div>

      {/* ── Two column layout ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Social Links */}
        <Card className="p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase font-mono">
              Social Links
            </h3>
            <Link
              to="/admin/content"
              className="text-xs text-muted hover:text-foreground font-mono transition-colors"
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
        </Card>

        {/* Right: Profile Image Preview */}
        <Card className="p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase font-mono">
              Visual Specimen Preview
            </h3>
            <Link
              to="/admin/media"
              className="text-xs text-muted hover:text-foreground font-mono transition-colors"
            >
              Media Library
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-xl bg-background border border-border overflow-hidden">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile preview"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted">
                <ImageIcon className="w-8 h-8 opacity-40" />
                <span className="text-xs">No image uploaded</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Content Completeness ────────────────── */}
      <Card className="p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase font-mono">
            Portfolio Content Completeness
          </h3>
          <Badge variant={completionPercent === 100 ? 'success' : completionPercent >= 70 ? 'warning' : 'neutral'}>
            {completionPercent}% complete
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-background border border-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-[var(--color-action-primary)]"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Items list */}
        <div className="divide-y divide-border">
          {completeness.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5">
              <span className="text-xs sm:text-sm text-foreground">{item.label}</span>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Quick Actions ───────────────────────── */}
      <Card className="p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase font-mono mb-2">
          Quick Management Portals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <QuickAction icon={Edit3} label="Edit Profile & Biography" href="/admin/content" />
          <QuickAction icon={Briefcase} label="Edit Work Experience" href="/admin/content" />
          <QuickAction icon={GraduationCap} label="Edit Education & Accreditations" href="/admin/content" />
          <QuickAction icon={Sparkles} label="Edit Skills Matrix" href="/admin/skills" />
          <QuickAction icon={Globe} label="Edit Social Links & Footers" href="/admin/footer-contact" />
          <QuickAction icon={ImageIcon} label="Media Library Assets" href="/admin/media" />
        </div>
      </Card>
    </div>
  );
};

export default ProfileOverview;
