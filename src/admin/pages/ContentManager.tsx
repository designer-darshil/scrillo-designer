import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  Wrench,
  Share2,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Upload,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  FileText,
  MapPin,
  Mail,
  Linkedin,
  Dribbble,
  Instagram,
  Check,
  Compass,
  Repeat,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import {
  ProfileContent,
  ContactCTA,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  SkillItem,
  ToolItem,
  SocialLink,
  FooterContent,
  HeroContent,
  PhilosophyContent,
  MarqueeContent,
} from '../../types';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

type ContentSubSection =
  | 'profile'
  | 'contact'
  | 'experience'
  | 'education'
  | 'skills'
  | 'tools'
  | 'social'
  | 'image'
  | 'philosophy'
  | 'marquee';

export const ContentManager: React.FC = () => {
  const {
    data,
    updateProfile,
    updateHero,
    updateContactCTA,
    updateFooter,
    updateExperience,
    updateEducation,
    updateTools,
    updatePhilosophy,
    updateMarquee,
    updateSkillCategory,
    createSkillCategory,
  } = useWebsiteData();

  const [activeTab, setActiveTab] = useState<ContentSubSection>('profile');

  // Local working state
  const [profileForm, setProfileForm] = useState<ProfileContent>(
    data.profile || {
      name: 'Darshil S. Bhuva',
      title: 'UI/UX Designer / Web Designer',
      primaryDescription:
        'As a UI/UX and Web Designer, I transform your ideas into dynamic digital experiences. Consider me your all-in-one expert for diverse business solutions.',
      objective:
        'Improve user experience through the utility, ease of use, and pleasure provided in the design and interaction with a product.',
      email: 'darshilbhuva4322@gmail.com',
      phone: '+91 8866 90 2600',
      location: 'Surat, Gujarat, India',
      address: '21 - Laxminagar Soc., Sarthana Jakatnaka, Surat. 06',
      profileImage: '/images/darshil-profile.jpg',
      coverImage: '/images/darshil-cover.png',
      linkedinUrl: 'https://linkedin.com/in/dsbhuva',
      dribbbleUrl: 'https://dribbble.com',
      behanceUrl: 'https://behance.net',
      instagramUrl: 'https://instagram.com',
    }
  );

  const [contactForm, setContactForm] = useState<ContactCTA>(data.contact);
  const [footerForm, setFooterForm] = useState<FooterContent>(data.footer);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(data.experience || []);
  const [educationList, setEducationList] = useState<EducationItem[]>(data.education || []);
  const [skillsList, setSkillsList] = useState<SkillCategory[]>(data.skills || []);
  const [toolsList, setToolsList] = useState<ToolItem[]>(data.tools || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(data.footer.socialLinks || []);
  const [philosophyForm, setPhilosophyForm] = useState<PhilosophyContent>(data.philosophy);
  const [marqueeForm, setMarqueeForm] = useState<MarqueeContent>(data.marquee);

  // UI state
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'profile' | 'cover'>('profile');

  // Buffer states for adding new items
  const [newSkillName, setNewSkillName] = useState('');
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState<'Design Tools' | 'Technical'>('Design Tools');
  const [newSocialPlatform, setNewSocialPlatform] = useState('LinkedIn');
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newMarqueeItem, setNewMarqueeItem] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent accidental loss of unsaved changes
  useUnsavedChanges(isDirty);

  // Sync initial state when remote data loads
  useEffect(() => {
    if (data.profile) setProfileForm(data.profile);
    setContactForm(data.contact);
    setFooterForm(data.footer);
    setExperienceList(data.experience || []);
    setEducationList(data.education || []);
    setSkillsList(data.skills || []);
    setToolsList(data.tools || []);
    setSocialLinks(data.footer.socialLinks || []);
    setPhilosophyForm(data.philosophy);
    setMarqueeForm(data.marquee);
    setIsDirty(false);
  }, [data]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  // Profile Form Handler
  const handleProfileChange = (field: keyof ProfileContent, value: string) => {
    markDirty();
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  // Experience Handlers
  const handleExperienceChange = (id: string, field: keyof ExperienceItem, value: any) => {
    markDirty();
    setExperienceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddExperience = () => {
    markDirty();
    const newId = `exp-${Date.now()}`;
    const newExp: ExperienceItem = {
      id: newId,
      company: 'New Company',
      role: 'UI/UX Designer',
      period: '2024 - Present',
      description: 'Describe role achievements, design deliverables, and technologies used.',
      order: experienceList.length + 1,
      visible: true,
    };
    setExperienceList((prev) => [...prev, newExp]);
  };

  const handleDeleteExperience = (id: string) => {
    markDirty();
    setExperienceList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === experienceList.length - 1)
    )
      return;
    markDirty();
    const newList = [...experienceList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    newList.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setExperienceList(newList);
  };

  // Education Handlers
  const handleEducationChange = (id: string, field: keyof EducationItem, value: any) => {
    markDirty();
    setEducationList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddEducation = () => {
    markDirty();
    const newId = `edu-${Date.now()}`;
    const newEdu: EducationItem = {
      id: newId,
      institution: 'New Institution',
      degree: 'Design / Computer Science',
      location: 'Gujarat, India',
      period: '2022 - 2026',
      description: 'Key academic foundations, specialization areas, and practical training.',
      order: educationList.length + 1,
      visible: true,
    };
    setEducationList((prev) => [...prev, newEdu]);
  };

  const handleDeleteEducation = (id: string) => {
    markDirty();
    setEducationList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveEducation = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === educationList.length - 1)
    )
      return;
    markDirty();
    const newList = [...educationList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    newList.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setEducationList(newList);
  };

  // Design Skills Handlers
  const designCategory = skillsList.find((c) => c.id === 'design') || skillsList[0];

  const handleAddDesignSkill = () => {
    if (!newSkillName.trim()) return;
    markDirty();
    const skillName = newSkillName.trim();
    setSkillsList((prev) =>
      prev.map((cat) => {
        if (cat.id === (designCategory?.id || 'design')) {
          const rawItems = cat.items || cat.skills || [];
          const nextIndex = String(rawItems.length + 1).padStart(2, '0');
          const newItem: SkillItem = {
            index: nextIndex,
            name: skillName,
            visible: true,
            order: rawItems.length + 1,
          };
          const updatedItems = [...rawItems, newItem];
          return {
            ...cat,
            count: String(updatedItems.length).padStart(2, '0'),
            items: updatedItems,
            skills: updatedItems,
          };
        }
        return cat;
      })
    );
    setNewSkillName('');
  };

  const handleDeleteDesignSkill = (skillName: string) => {
    markDirty();
    setSkillsList((prev) =>
      prev.map((cat) => {
        if (cat.id === (designCategory?.id || 'design')) {
          const rawItems = (cat.items || cat.skills || []).filter((s) => s.name !== skillName);
          const renumbered = rawItems.map((s, idx) => ({
            ...s,
            index: String(idx + 1).padStart(2, '0'),
            order: idx + 1,
          }));
          return {
            ...cat,
            count: String(renumbered.length).padStart(2, '0'),
            items: renumbered,
            skills: renumbered,
          };
        }
        return cat;
      })
    );
  };

  const handleToggleSkillVisibility = (skillName: string) => {
    markDirty();
    setSkillsList((prev) =>
      prev.map((cat) => {
        if (cat.id === (designCategory?.id || 'design')) {
          const rawItems = (cat.items || cat.skills || []).map((s) =>
            s.name === skillName ? { ...s, visible: s.visible === false } : s
          );
          return { ...cat, items: rawItems, skills: rawItems };
        }
        return cat;
      })
    );
  };

  const handleMoveDesignSkill = (index: number, direction: 'up' | 'down') => {
    const rawItems = [...(designCategory?.items || designCategory?.skills || [])];
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === rawItems.length - 1)
    )
      return;
    markDirty();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = rawItems[index];
    rawItems[index] = rawItems[targetIndex];
    rawItems[targetIndex] = temp;
    const renumbered = rawItems.map((s, idx) => ({
      ...s,
      index: String(idx + 1).padStart(2, '0'),
      order: idx + 1,
    }));
    setSkillsList((prev) =>
      prev.map((cat) =>
        cat.id === (designCategory?.id || 'design')
          ? { ...cat, items: renumbered, skills: renumbered }
          : cat
      )
    );
  };

  // Tools Handlers
  const handleAddTool = () => {
    if (!newToolName.trim()) return;
    markDirty();
    const newTool: ToolItem = {
      id: `tool-${Date.now()}`,
      name: newToolName.trim(),
      category: newToolCategory,
      order: toolsList.length + 1,
    };
    setToolsList((prev) => [...prev, newTool]);
    setNewToolName('');
  };

  const handleDeleteTool = (id: string) => {
    markDirty();
    setToolsList((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMoveTool = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === toolsList.length - 1)
    )
      return;
    markDirty();
    const newList = [...toolsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    newList.forEach((t, idx) => {
      t.order = idx + 1;
    });
    setToolsList(newList);
  };

  // Social Link Handlers
  const handleAddSocialLink = () => {
    if (!newSocialUrl.trim()) return;
    const urlValidation = validators.url(newSocialUrl, false, 'Social Link URL');
    if (!urlValidation.isValid) {
      setErrorMessage(urlValidation.error || 'Invalid URL format');
      setStatus('error');
      return;
    }
    markDirty();
    const newSoc: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      label: newSocialLabel.trim() || newSocialPlatform,
      href: newSocialUrl.trim(),
      url: newSocialUrl.trim(),
      visible: true,
      order: socialLinks.length + 1,
    };
    setSocialLinks((prev) => [...prev, newSoc]);
    setNewSocialLabel('');
    setNewSocialUrl('');
    setErrorMessage(null);
  };

  const handleDeleteSocialLink = (index: number) => {
    markDirty();
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleToggleSocialVisibility = (index: number) => {
    markDirty();
    setSocialLinks((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, visible: item.visible === false } : item))
    );
  };

  const handleMoveSocialLink = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === socialLinks.length - 1)
    )
      return;
    markDirty();
    const newList = [...socialLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    newList.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setSocialLinks(newList);
  };

  // Image Upload / Replace / Remove
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileValidation = validators.imageFile(file);
    if (!fileValidation.isValid) {
      setErrorMessage(fileValidation.error || 'Invalid image file');
      setStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      markDirty();
      if (mediaTarget === 'profile') {
        setProfileForm((prev) => ({ ...prev, profileImage: dataUrl }));
      } else {
        setProfileForm((prev) => ({ ...prev, coverImage: dataUrl }));
      }
      setStatus('idle');
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleMediaModalSelect = (url: string) => {
    markDirty();
    if (mediaTarget === 'profile') {
      setProfileForm((prev) => ({ ...prev, profileImage: url }));
    } else {
      setProfileForm((prev) => ({ ...prev, coverImage: url }));
    }
    setIsMediaPickerOpen(false);
  };

  // Master Save Handler
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage(null);

    // Validate email
    const emailValidation = validators.email(profileForm.email, false, 'Email');
    if (!emailValidation.isValid) {
      setStatus('error');
      setErrorMessage(emailValidation.error || 'Invalid email address');
      return;
    }

    try {
      // 1. Update Profile & Sync with Hero & Contact
      const profilePromise = updateProfile(profileForm);

      // 2. Synchronize Hero & Footer with Profile
      const heroSync: HeroContent = {
        ...data.hero,
        subEyebrow: profileForm.title,
        description: profileForm.primaryDescription,
        heroImage: profileForm.profileImage,
      };
      const heroPromise = updateHero(heroSync);

      // 3. Update Contact CTA
      const contactSync: ContactCTA = {
        ...contactForm,
        email: profileForm.email,
        coordinates: profileForm.location,
      };
      const contactPromise = updateContactCTA(contactSync);

      // 4. Update Footer with brand name, location, email, and social links
      const footerSync: FooterContent = {
        ...footerForm,
        brandText: profileForm.name.toUpperCase(),
        location: profileForm.location.toUpperCase(),
        email: profileForm.email,
        socialLinks,
      };
      const footerPromise = updateFooter(footerSync);

      // 5. Update Experience, Education, Tools, Philosophy, Marquee
      const expPromise = updateExperience(experienceList);
      const eduPromise = updateEducation(educationList);
      const toolsPromise = updateTools(toolsList);
      const philPromise = updatePhilosophy(philosophyForm);
      const marqPromise = updateMarquee(marqueeForm);

      const results = await Promise.all([
        profilePromise,
        heroPromise,
        contactPromise,
        footerPromise,
        expPromise,
        eduPromise,
        toolsPromise,
        philPromise,
        marqPromise,
      ]);

      if (results.every(Boolean)) {
        setStatus('saved');
        setIsDirty(false);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save some sections to persistent storage.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(validators.formatFriendlyError(err));
    }
  };

  const navTabs: { id: ContentSubSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'profile', label: '1. Profile', icon: User },
    { id: 'contact', label: '2. Contact', icon: Phone },
    { id: 'experience', label: '3. Experience', icon: Briefcase },
    { id: 'education', label: '4. Education', icon: GraduationCap },
    { id: 'skills', label: '5. Skills', icon: Sparkles },
    { id: 'tools', label: '6. Design Tools', icon: Wrench },
    { id: 'social', label: '7. Social Links', icon: Share2 },
    { id: 'image', label: '8. Profile Image', icon: ImageIcon },
    { id: 'philosophy', label: '9. Philosophy', icon: Compass },
    { id: 'marquee', label: '10. Marquee Strip', icon: Repeat },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans uppercase">
            Resume & Profile Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted font-mono mt-1">
            Single Source of Truth backed by Resume.pdf (Darshil S. Bhuva)
          </p>
        </div>

        {/* Global Save Button with State Feedback */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={status === 'saving'}
            className={`min-h-[44px] px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs ${
              status === 'saved'
                ? 'bg-emerald-600 text-white'
                : status === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-foreground text-background hover:opacity-90'
            }`}
          >
            {status === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : status === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Live</span>
              </>
            ) : status === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Retry Save</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes {isDirty && '•'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-300 font-bold"
          >
            [Dismiss]
          </button>
        </div>
      )}

      {/* Navigation Subsections (8 Tabs) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface border border-border overflow-x-auto no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap min-h-[44px] ${
                isActive
                  ? 'bg-background text-foreground font-bold shadow-xs border border-border/80'
                  : 'text-muted hover:text-foreground hover:bg-background/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBSECTION 1: PROFILE EDITOR */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-foreground" />
              <span>Profile Information</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              Core identity, professional title, and design philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="profile-name" className="block text-xs font-semibold text-foreground">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={profileForm.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Darshil S. Bhuva"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Professional Title */}
            <div className="space-y-2">
              <label htmlFor="profile-title" className="block text-xs font-semibold text-foreground">
                Professional Title
              </label>
              <input
                id="profile-title"
                type="text"
                value={profileForm.title}
                onChange={(e) => handleProfileChange('title', e.target.value)}
                placeholder="UI/UX Designer / Web Designer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="profile-location" className="block text-xs font-semibold text-foreground">
                Location
              </label>
              <input
                id="profile-location"
                type="text"
                value={profileForm.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder="Surat, Gujarat, India"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label htmlFor="profile-avail" className="block text-xs font-semibold text-foreground">
                Availability Status
              </label>
              <input
                id="profile-avail"
                type="text"
                value={contactForm.availabilityStatus || 'AVAILABLE FOR COMMISSIONS // +91 8866 90 2600'}
                onChange={(e) => {
                  markDirty();
                  setContactForm((prev) => ({ ...prev, availabilityStatus: e.target.value }));
                }}
                placeholder="AVAILABLE FOR COMMISSIONS // +91 8866 90 2600"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Short Introduction */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="profile-short-intro" className="block text-xs font-semibold text-foreground">
                Short Introduction (Hero Tagline)
              </label>
              <input
                id="profile-short-intro"
                type="text"
                value={data.hero.title}
                onChange={(e) => {
                  markDirty();
                  updateHero({ ...data.hero, title: e.target.value, headlineLines: e.target.value.split('\n') });
                }}
                placeholder="Transforming ideas into dynamic digital experiences."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Long Introduction */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="profile-primary-desc" className="block text-xs font-semibold text-foreground">
                Primary Description (Resume Biography)
              </label>
              <textarea
                id="profile-primary-desc"
                rows={3}
                value={profileForm.primaryDescription}
                onChange={(e) => handleProfileChange('primaryDescription', e.target.value)}
                placeholder="As a UI/UX and Web Designer, I transform your ideas into dynamic digital experiences. Consider me your all-in-one expert for diverse business solutions."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Design Philosophy / Objective */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="profile-objective" className="block text-xs font-semibold text-foreground">
                Design Objective & Philosophy
              </label>
              <textarea
                id="profile-objective"
                rows={2}
                value={profileForm.objective}
                onChange={(e) => handleProfileChange('objective', e.target.value)}
                placeholder="Improve user experience through the utility, ease of use, and pleasure provided in the design and interaction with a product."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 2: CONTACT EDITOR */}
      {activeTab === 'contact' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-foreground" />
              <span>Contact & Outreach</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              Official email, phone number, and physical coordinates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={profileForm.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="darshilbhuva4322@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="contact-phone" className="block text-xs font-semibold text-foreground">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="text"
                value={profileForm.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="+91 8866 90 2600"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="contact-address" className="block text-xs font-semibold text-foreground">
                Full Address
              </label>
              <input
                id="contact-address"
                type="text"
                value={profileForm.address || '21 - Laxminagar Soc., Sarthana Jakatnaka, Surat. 06'}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                placeholder="21 - Laxminagar Soc., Sarthana Jakatnaka, Surat. 06"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label htmlFor="contact-city" className="block text-xs font-semibold text-foreground">
                City
              </label>
              <input
                id="contact-city"
                type="text"
                value={profileForm.city || 'Surat'}
                onChange={(e) => handleProfileChange('city', e.target.value)}
                placeholder="Surat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Country/Region */}
            <div className="space-y-2">
              <label htmlFor="contact-country" className="block text-xs font-semibold text-foreground">
                Country / Region
              </label>
              <input
                id="contact-country"
                type="text"
                value={profileForm.country || 'Gujarat, India'}
                onChange={(e) => handleProfileChange('country', e.target.value)}
                placeholder="Gujarat, India"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Social Direct Fields */}
            <div className="space-y-2">
              <label htmlFor="contact-linkedin" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-foreground" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                id="contact-linkedin"
                type="url"
                value={profileForm.linkedinUrl || 'https://linkedin.com/in/dsbhuva'}
                onChange={(e) => handleProfileChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/dsbhuva"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-dribbble" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Dribbble className="w-3.5 h-3.5 text-foreground" />
                <span>Dribbble Profile URL</span>
              </label>
              <input
                id="contact-dribbble"
                type="url"
                value={profileForm.dribbbleUrl || 'https://dribbble.com'}
                onChange={(e) => handleProfileChange('dribbbleUrl', e.target.value)}
                placeholder="https://dribbble.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-behance" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-foreground" />
                <span>Behance Profile URL</span>
              </label>
              <input
                id="contact-behance"
                type="url"
                value={profileForm.behanceUrl || 'https://behance.net'}
                onChange={(e) => handleProfileChange('behanceUrl', e.target.value)}
                placeholder="https://behance.net"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-instagram" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-foreground" />
                <span>Instagram Profile URL</span>
              </label>
              <input
                id="contact-instagram"
                type="url"
                value={profileForm.instagramUrl || 'https://instagram.com'}
                onChange={(e) => handleProfileChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 3: EXPERIENCE EDITOR */}
      {activeTab === 'experience' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-foreground" />
                <span>Professional Experience</span>
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Manage companies, job titles, start/end dates, current status, and achievements.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddExperience}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="space-y-4">
            {experienceList.map((exp, index) => (
              <div
                key={exp.id}
                className="p-5 rounded-xl border border-border bg-background space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-muted">
                      [0{index + 1}]
                    </span>
                    <span className="font-bold text-sm text-foreground uppercase">
                      {exp.company || 'Unnamed Company'}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      — {exp.role || 'UI/UX Designer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(index, 'down')}
                      disabled={index === experienceList.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExperienceChange(exp.id, 'visible', !exp.visible)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        exp.visible !== false
                          ? 'border-border text-emerald-500'
                          : 'border-border text-muted opacity-50'
                      }`}
                      title={exp.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {exp.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Period (Display Range)
                    </label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleExperienceChange(exp.id, 'period', e.target.value)}
                      placeholder="e.g. Mar 2022 - Present"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                      placeholder="e.g. Mar 2022"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={exp.endDate || ''}
                      disabled={exp.currentlyWorking}
                      onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                      placeholder="e.g. Present / Nov 2023"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground disabled:opacity-40"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground select-none">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking || exp.period?.toLowerCase().includes('present')}
                        onChange={(e) => {
                          const isCurrent = e.target.checked;
                          handleExperienceChange(exp.id, 'currentlyWorking', isCurrent);
                          if (isCurrent) {
                            handleExperienceChange(exp.id, 'endDate', 'Present');
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span>Currently Working Here</span>
                    </label>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Description & Deliverables
                    </label>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION 4: EDUCATION EDITOR */}
      {activeTab === 'education' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-foreground" />
                <span>Education Foundation</span>
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Academic institutions, education types, locations, and tenures.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEducation}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-4">
            {educationList.map((edu, index) => (
              <div
                key={edu.id}
                className="p-5 rounded-xl border border-border bg-background space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-muted">
                      [0{index + 1}]
                    </span>
                    <span className="font-bold text-sm text-foreground uppercase">
                      {edu.institution || 'Institution'}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      — {edu.educationType || edu.degree || 'Degree / Diploma'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleMoveEducation(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveEducation(index, 'down')}
                      disabled={index === educationList.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEducationChange(edu.id, 'visible', !edu.visible)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        edu.visible !== false
                          ? 'border-border text-emerald-500'
                          : 'border-border text-muted opacity-50'
                      }`}
                      title={edu.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {edu.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Education Type / Degree
                    </label>
                    <input
                      type="text"
                      value={edu.educationType || edu.degree || ''}
                      onChange={(e) => {
                        handleEducationChange(edu.id, 'educationType', e.target.value);
                        handleEducationChange(edu.id, 'degree', e.target.value);
                      }}
                      placeholder="e.g. Higher Secondary / Diploma"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location || 'Surat, Gujarat'}
                      onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                      placeholder="e.g. Surat, Gujarat"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Period (Display Range)
                    </label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleEducationChange(edu.id, 'period', e.target.value)}
                      placeholder="e.g. 2017 - 2018"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={edu.startDate || ''}
                      onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                      placeholder="e.g. 2017"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                      placeholder="e.g. 2018"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono text-foreground"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                      Description & Scope
                    </label>
                    <textarea
                      rows={2}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs text-foreground leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION 5: SKILLS EDITOR (DESIGN) */}
      {activeTab === 'skills' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span>Design Disciplines & Capabilities</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              Core design specializations (Wireframes & Flows, Prototyping, UI, Interaction Design).
            </p>
          </div>

          <div className="space-y-4">
            {/* Input to Add New Skill */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDesignSkill())}
                placeholder="e.g. Wireframes & Flows, Interaction Design..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
              <button
                type="button"
                onClick={handleAddDesignSkill}
                disabled={!newSkillName.trim()}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                Add Skill
              </button>
            </div>

            {/* List of current design skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(designCategory?.items || designCategory?.skills || []).map((skill, index) => (
                <div
                  key={skill.name}
                  className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-xs text-muted font-semibold">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                    <span className="font-semibold text-xs text-foreground truncate">
                      {skill.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveDesignSkill(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDesignSkill(index, 'down')}
                      disabled={index === (designCategory?.items || designCategory?.skills || []).length - 1}
                      className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSkillVisibility(skill.name)}
                      className={`p-1 text-xs ${
                        skill.visible !== false ? 'text-emerald-500' : 'text-muted opacity-40'
                      }`}
                      title={skill.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {skill.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDesignSkill(skill.name)}
                      className="p-1 text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 6: DESIGN TOOLS EDITOR */}
      {activeTab === 'tools' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4 text-foreground" />
              <span>Design Tools & Technical Stack</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              Tools and technologies (Figma, Adobe XD, Photoshop, Illustrator, HTML/CSS, JavaScript, Bootstrap, GitHub).
            </p>
          </div>

          <div className="space-y-4">
            {/* Input to Add New Tool */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                placeholder="e.g. Figma, Adobe Illustrator, GitHub..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
              <select
                value={newToolCategory}
                onChange={(e: any) => setNewToolCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground"
              >
                <option value="Design Tools">Design Tools</option>
                <option value="Technical">Technical</option>
              </select>
              <button
                type="button"
                onClick={handleAddTool}
                disabled={!newToolName.trim()}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                Add Tool
              </button>
            </div>

            {/* List of current tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {toolsList.map((tool, idx) => (
                <div
                  key={tool.id || idx}
                  className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between gap-3 group"
                >
                  <div className="truncate">
                    <p className="font-bold text-xs text-foreground truncate">{tool.name}</p>
                    <span className="font-mono text-[10px] text-muted">{tool.category}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveTool(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveTool(idx, 'down')}
                      disabled={idx === toolsList.length - 1}
                      className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTool(tool.id)}
                      className="p-1 text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 7: SOCIAL LINKS EDITOR */}
      {activeTab === 'social' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4 text-foreground" />
              <span>Social Links Directory</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              LinkedIn, Dribbble, Behance, and Instagram profiles.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input to Add New Social */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <select
                value={newSocialPlatform}
                onChange={(e) => {
                  setNewSocialPlatform(e.target.value);
                  setNewSocialLabel(e.target.value);
                }}
                className="sm:col-span-3 px-3 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Dribbble">Dribbble</option>
                <option value="Behance">Behance</option>
                <option value="Instagram">Instagram</option>
                <option value="GitHub">GitHub</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="https://linkedin.com/in/dsbhuva"
                className="sm:col-span-6 px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted"
              />

              <button
                type="button"
                onClick={handleAddSocialLink}
                disabled={!newSocialUrl.trim()}
                className="sm:col-span-3 min-h-[44px] px-4 py-2.5 rounded-xl bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                Add Link
              </button>
            </div>

            {/* List of social links */}
            <div className="space-y-2">
              {socialLinks.map((soc, idx) => (
                <div
                  key={soc.id || idx}
                  className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-bold text-xs text-foreground uppercase">{soc.label}</span>
                    <span className="font-mono text-xs text-muted truncate">{soc.href || soc.url}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveSocialLink(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSocialLink(idx, 'down')}
                      disabled={idx === socialLinks.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSocialVisibility(idx)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        soc.visible !== false ? 'border-border text-emerald-500' : 'border-border text-muted opacity-40'
                      }`}
                      title={soc.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {soc.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(idx)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 8: PROFILE IMAGE & VISUAL SPECIMENS */}
      {activeTab === 'image' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-foreground" />
              <span>Profile Photo & Cover Artifact</span>
            </h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              Manage resume profile headshot, media uploads, and portfolio cover specimen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Profile Headshot */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Profile Photograph (Resume)
                </span>
                <span className="font-mono text-[10px] text-muted">[1200 × 1200]</span>
              </div>

              <div className="w-full aspect-square max-w-[240px] mx-auto overflow-hidden rounded-xl border border-border bg-surface shadow-md">
                <img
                  src={profileForm.profileImage || '/images/darshil-profile.jpg'}
                  alt="Profile"
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('profile');
                    fileInputRef.current?.click();
                  }}
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-lg border border-border font-mono text-xs uppercase text-foreground hover:bg-surface flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('profile');
                    setIsMediaPickerOpen(true);
                  }}
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-lg bg-foreground text-background font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Choose Media</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleProfileChange('profileImage', '')}
                  className="min-h-[40px] px-3 py-2 rounded-lg border border-red-500/30 text-red-400 font-mono text-xs uppercase hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* 2. Cover / Portfolio Visual Specimen */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Cover / Specimen Artifact
                </span>
                <span className="font-mono text-[10px] text-muted">[4032 × 2268]</span>
              </div>

              <div className="w-full aspect-video max-w-[320px] mx-auto overflow-hidden rounded-xl border border-border bg-surface shadow-md">
                <img
                  src={profileForm.coverImage || '/images/darshil-cover.png'}
                  alt="Cover Artifact"
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('cover');
                    fileInputRef.current?.click();
                  }}
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-lg border border-border font-mono text-xs uppercase text-foreground hover:bg-surface flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('cover');
                    setIsMediaPickerOpen(true);
                  }}
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-lg bg-foreground text-background font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Choose Media</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 9: PHILOSOPHY EDITOR */}
      {activeTab === 'philosophy' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                <Compass className="w-4 h-4 text-foreground" />
                <span>Design Philosophy Statement</span>
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Editable design philosophy thesis, typographic line breaks, and author attribution.
              </p>
            </div>
            {philosophyForm.placeholder && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-500">
                Default Content
              </span>
            )}
          </div>

          {/* Editable Statement Notice */}
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3 text-xs text-foreground">
            <Compass className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Editable Default Philosophy</p>
              <p className="text-muted leading-relaxed">
                The resume emphasizes utility, ease of use, and pleasure in product interaction. The default editable statement is <span className="text-foreground font-semibold">"Design should make complex things feel simple."</span> You can edit or refine this statement at any time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Main Statement */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="phil-main" className="block text-xs font-semibold text-foreground">
                Main Philosophy Statement
              </label>
              <textarea
                id="phil-main"
                rows={2}
                value={philosophyForm.mainStatement || philosophyForm.title || ''}
                onChange={(e) => {
                  markDirty();
                  const val = e.target.value;
                  const parts = val.split(' ');
                  const mid = Math.ceil(parts.length / 3);
                  setPhilosophyForm((prev) => ({
                    ...prev,
                    mainStatement: val,
                    title: val,
                    line1: parts.slice(0, mid).join(' '),
                    line2: parts.slice(mid, mid * 2).join(' '),
                    line3: parts.slice(mid * 2).join(' '),
                  }));
                }}
                placeholder="Design should make complex things feel simple."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Typographic Line 1 */}
            <div className="space-y-2">
              <label htmlFor="phil-line1" className="block text-xs font-semibold text-foreground">
                Display Headline Line 1
              </label>
              <input
                id="phil-line1"
                type="text"
                value={philosophyForm.line1 || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({ ...prev, line1: e.target.value }));
                }}
                placeholder="Design should make"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Typographic Line 2 */}
            <div className="space-y-2">
              <label htmlFor="phil-line2" className="block text-xs font-semibold text-foreground">
                Display Headline Line 2 (Indented)
              </label>
              <input
                id="phil-line2"
                type="text"
                value={philosophyForm.line2 || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({ ...prev, line2: e.target.value }));
                }}
                placeholder="complex things"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Typographic Line 3 */}
            <div className="space-y-2">
              <label htmlFor="phil-line3" className="block text-xs font-semibold text-foreground">
                Display Headline Line 3
              </label>
              <input
                id="phil-line3"
                type="text"
                value={philosophyForm.line3 || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({ ...prev, line3: e.target.value }));
                }}
                placeholder="feel simple."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Author Attribution */}
            <div className="space-y-2">
              <label htmlFor="phil-author" className="block text-xs font-semibold text-foreground">
                Author Attribution
              </label>
              <input
                id="phil-author"
                type="text"
                value={philosophyForm.author || philosophyForm.attribution || philosophyForm.yearMeta || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({
                    ...prev,
                    author: e.target.value,
                    attribution: e.target.value,
                    yearMeta: e.target.value,
                  }));
                }}
                placeholder="— DARSHIL S. BHUVA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono uppercase text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 10: MARQUEE STRIP EDITOR */}
      {activeTab === 'marquee' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/30 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                <Repeat className="w-4 h-4 text-foreground" />
                <span>Kinetic Marquee Typography</span>
              </h2>
              <p className="text-xs text-muted font-mono mt-0.5">
                Manage moving ticker phrases, velocity animation, and separator tokens.
              </p>
            </div>
            {marqueeForm.placeholder && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-500">
                Default Content
              </span>
            )}
          </div>

          {/* Marquee Add New Item Bar */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <input
              type="text"
              value={newMarqueeItem}
              onChange={(e) => setNewMarqueeItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newMarqueeItem.trim()) {
                  e.preventDefault();
                  markDirty();
                  setMarqueeForm((prev) => ({
                    ...prev,
                    items: [...prev.items, newMarqueeItem.trim().toUpperCase()],
                  }));
                  setNewMarqueeItem('');
                }
              }}
              placeholder="e.g. DIGITAL EXPERIENCES"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold uppercase text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
            />
            <button
              type="button"
              onClick={() => {
                if (!newMarqueeItem.trim()) return;
                markDirty();
                setMarqueeForm((prev) => ({
                  ...prev,
                  items: [...prev.items, newMarqueeItem.trim().toUpperCase()],
                }));
                setNewMarqueeItem('');
              }}
              disabled={!newMarqueeItem.trim()}
              className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phrase</span>
            </button>
          </div>

          {/* Active Items List */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Current Marquee Phrases ({marqueeForm.items.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {marqueeForm.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background"
                >
                  <span className="font-bold text-xs uppercase text-foreground truncate">
                    {idx + 1}. {item}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (idx === 0) return;
                        markDirty();
                        const copy = [...marqueeForm.items];
                        const temp = copy[idx];
                        copy[idx] = copy[idx - 1];
                        copy[idx - 1] = temp;
                        setMarqueeForm((prev) => ({ ...prev, items: copy }));
                      }}
                      disabled={idx === 0}
                      className="p-1 rounded-md border border-border text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (idx === marqueeForm.items.length - 1) return;
                        markDirty();
                        const copy = [...marqueeForm.items];
                        const temp = copy[idx];
                        copy[idx] = copy[idx + 1];
                        copy[idx + 1] = temp;
                        setMarqueeForm((prev) => ({ ...prev, items: copy }));
                      }}
                      disabled={idx === marqueeForm.items.length - 1}
                      className="p-1 rounded-md border border-border text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        markDirty();
                        setMarqueeForm((prev) => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="p-1 rounded-md border border-red-500/20 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Speed & Separator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Loop Duration (Seconds)</label>
              <input
                type="number"
                min={10}
                max={120}
                value={marqueeForm.speed || 30}
                onChange={(e) => {
                  markDirty();
                  setMarqueeForm((prev) => ({ ...prev, speed: Number(e.target.value) || 30 }));
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Separator Token</label>
              <input
                type="text"
                value={marqueeForm.separator || '✦'}
                onChange={(e) => {
                  markDirty();
                  setMarqueeForm((prev) => ({ ...prev, separator: e.target.value }));
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Movement Direction</label>
              <select
                value={marqueeForm.direction || 'left'}
                onChange={(e) => {
                  markDirty();
                  setMarqueeForm((prev) => ({ ...prev, direction: e.target.value as 'left' | 'right' }));
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground"
              >
                <option value="left">Left (Standard)</option>
                <option value="right">Right (Reverse)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaModalSelect}
        title={mediaTarget === 'profile' ? 'Select Profile Photo' : 'Select Cover Artifact'}
      />
    </div>
  );
};

export default ContentManager;
