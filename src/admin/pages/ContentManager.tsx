import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
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
import { Button } from '../../design-system/components/Button';
import { Input, Textarea } from '../../design-system/components/Input';
import { Badge } from '../../design-system/components/Badge';
import { Alert } from '../../design-system/components/Alert';
import { Card, CardTitle, CardDescription } from '../../design-system/components/Card';
import { useToast } from '../../design-system/hooks/useToast';

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
  } = useWebsiteData();
  const toast = useToast();

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
    toast.info('New experience role added');
  };

  const handleDeleteExperience = (id: string) => {
    markDirty();
    setExperienceList((prev) => prev.filter((item) => item.id !== id));
    toast.info('Experience item removed');
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
    toast.info('New education entry added');
  };

  const handleDeleteEducation = (id: string) => {
    markDirty();
    setEducationList((prev) => prev.filter((item) => item.id !== id));
    toast.info('Education entry removed');
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
    toast.success(`Added skill "${skillName}"`);
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
    toast.success(`Added tool "${newTool.name}"`);
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
      toast.error(urlValidation.error || 'Invalid URL format');
      return;
    }
    markDirty();
    const newSoc: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform as any,
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
    toast.success(`Added ${newSoc.label}`);
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
      toast.error(fileValidation.error || 'Invalid image file');
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
      toast.success('Image loaded successfully');
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
    toast.success('Image updated from media library');
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
      toast.error(emailValidation.error || 'Invalid email address');
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
        toast.success('Content changes saved live!');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save some sections to persistent storage.');
        toast.error('Failed to save some sections.');
      }
    } catch (err: any) {
      setStatus('error');
      const formatted = validators.formatFriendlyError(err);
      setErrorMessage(formatted);
      toast.error(formatted);
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
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin Content Editor</span>
              <span className="text-xs text-muted">/</span>
              <Badge variant="neutral" size="sm" className="font-mono uppercase">
                RESUME & PROFILE
              </Badge>
              {isDirty && (
                <Badge variant="warning" size="sm" className="animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans uppercase">
              Resume & Profile Manager
            </h1>
            <p className="text-xs sm:text-sm text-muted font-mono mt-1">
              Single Source of Truth backed by Resume.pdf (Darshil S. Bhuva)
            </p>
          </div>

          {/* Global Save Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSaveAll}
              disabled={status === 'saving'}
              isLoading={status === 'saving'}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes {isDirty && '•'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Alert Banner */}
      {errorMessage && (
        <Alert
          variant="error"
          title="Validation / Storage Error"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}

      {status === 'saved' && (
        <Alert
          variant="success"
          title="Content updated successfully!"
          onClose={() => setStatus('idle')}
        >
          Profile, career timeline, and skills are synchronized across the public portfolio.
        </Alert>
      )}

      {/* Navigation Subsections (10 Tabs) */}
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
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-foreground" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              Core identity, professional title, and design philosophy.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Darshil S. Bhuva"
                className="font-bold text-xs"
              />
            </div>

            {/* Professional Title */}
            <div>
              <Input
                label="Professional Title"
                value={profileForm.title}
                onChange={(e) => handleProfileChange('title', e.target.value)}
                placeholder="UI/UX Designer / Web Designer"
              />
            </div>

            {/* Location */}
            <div>
              <Input
                label="Location"
                value={profileForm.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder="Surat, Gujarat, India"
              />
            </div>

            {/* Availability */}
            <div>
              <Input
                label="Availability Status"
                value={contactForm.availabilityStatus || 'AVAILABLE FOR COMMISSIONS // +91 8866 90 2600'}
                onChange={(e) => {
                  markDirty();
                  setContactForm((prev) => ({ ...prev, availabilityStatus: e.target.value }));
                }}
                placeholder="AVAILABLE FOR COMMISSIONS // +91 8866 90 2600"
                className="font-mono text-xs"
              />
            </div>

            {/* Short Introduction */}
            <div className="md:col-span-2">
              <Input
                label="Short Introduction (Hero Tagline)"
                value={data.hero.title}
                onChange={(e) => {
                  markDirty();
                  updateHero({ ...data.hero, title: e.target.value, headlineLines: e.target.value.split('\n') });
                }}
                placeholder="Transforming ideas into dynamic digital experiences."
              />
            </div>

            {/* Long Introduction */}
            <div className="md:col-span-2">
              <Textarea
                label="Primary Description (Resume Biography)"
                rows={3}
                value={profileForm.primaryDescription}
                onChange={(e) => handleProfileChange('primaryDescription', e.target.value)}
                placeholder="As a UI/UX and Web Designer, I transform your ideas into dynamic digital experiences. Consider me your all-in-one expert for diverse business solutions."
              />
            </div>

            {/* Design Philosophy / Objective */}
            <div className="md:col-span-2">
              <Textarea
                label="Design Objective & Philosophy"
                rows={2}
                value={profileForm.objective}
                onChange={(e) => handleProfileChange('objective', e.target.value)}
                placeholder="Improve user experience through the utility, ease of use, and pleasure provided in the design and interaction with a product."
              />
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 2: CONTACT EDITOR */}
      {activeTab === 'contact' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="w-4 h-4 text-foreground" />
              <span>Contact & Outreach</span>
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              Official email, phone number, and physical coordinates.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <Input
                label="Email Address"
                type="email"
                value={profileForm.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="darshilbhuva4322@gmail.com"
                className="font-mono text-xs"
              />
            </div>

            {/* Phone */}
            <div>
              <Input
                label="Phone Number"
                value={profileForm.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="+91 8866 90 2600"
                className="font-mono text-xs"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Input
                label="Full Address"
                value={profileForm.address || '21 - Laxminagar Soc., Sarthana Jakatnaka, Surat. 06'}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                placeholder="21 - Laxminagar Soc., Sarthana Jakatnaka, Surat. 06"
              />
            </div>

            {/* City */}
            <div>
              <Input
                label="City"
                value={profileForm.city || 'Surat'}
                onChange={(e) => handleProfileChange('city', e.target.value)}
                placeholder="Surat"
              />
            </div>

            {/* Country/Region */}
            <div>
              <Input
                label="Country / Region"
                value={profileForm.country || 'Gujarat, India'}
                onChange={(e) => handleProfileChange('country', e.target.value)}
                placeholder="Gujarat, India"
              />
            </div>

            {/* Social Direct Fields */}
            <div>
              <Input
                label="LinkedIn Profile URL"
                type="url"
                value={profileForm.linkedinUrl || 'https://linkedin.com/in/dsbhuva'}
                onChange={(e) => handleProfileChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/dsbhuva"
                className="font-mono text-xs"
              />
            </div>

            <div>
              <Input
                label="Dribbble Profile URL"
                type="url"
                value={profileForm.dribbbleUrl || 'https://dribbble.com'}
                onChange={(e) => handleProfileChange('dribbbleUrl', e.target.value)}
                placeholder="https://dribbble.com"
                className="font-mono text-xs"
              />
            </div>

            <div>
              <Input
                label="Behance Profile URL"
                type="url"
                value={profileForm.behanceUrl || 'https://behance.net'}
                onChange={(e) => handleProfileChange('behanceUrl', e.target.value)}
                placeholder="https://behance.net"
                className="font-mono text-xs"
              />
            </div>

            <div>
              <Input
                label="Instagram Profile URL"
                type="url"
                value={profileForm.instagramUrl || 'https://instagram.com'}
                onChange={(e) => handleProfileChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com"
                className="font-mono text-xs"
              />
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 3: EXPERIENCE EDITOR */}
      {activeTab === 'experience' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="w-4 h-4 text-foreground" />
                <span>Professional Experience</span>
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Manage companies, job titles, start/end dates, current status, and achievements.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddExperience}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Experience
            </Button>
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
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(index, 'down')}
                      disabled={index === experienceList.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                      aria-label="Move Down"
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
                      aria-label={exp.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {exp.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                      className="font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <Input
                      label="Job Title"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      label="Period (Display Range)"
                      value={exp.period}
                      onChange={(e) => handleExperienceChange(exp.id, 'period', e.target.value)}
                      placeholder="e.g. Mar 2022 - Present"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div>
                    <Input
                      label="Start Date"
                      value={exp.startDate || ''}
                      onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                      placeholder="e.g. Mar 2022"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div>
                    <Input
                      label="End Date"
                      value={exp.endDate || ''}
                      disabled={exp.currentlyWorking}
                      onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                      placeholder="e.g. Present / Nov 2023"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
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
                    <Textarea
                      label="Description & Deliverables"
                      rows={3}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SUBSECTION 4: EDUCATION EDITOR */}
      {activeTab === 'education' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="w-4 h-4 text-foreground" />
                <span>Education Foundation</span>
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Academic institutions, education types, locations, and tenures.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddEducation}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Education
            </Button>
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
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveEducation(index, 'down')}
                      disabled={index === educationList.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                      aria-label="Move Down"
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
                      aria-label={edu.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {edu.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                      className="font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <Input
                      label="Education Type / Degree"
                      value={edu.educationType || edu.degree || ''}
                      onChange={(e) => {
                        handleEducationChange(edu.id, 'educationType', e.target.value);
                        handleEducationChange(edu.id, 'degree', e.target.value);
                      }}
                      placeholder="e.g. Higher Secondary / Diploma"
                    />
                  </div>

                  <div>
                    <Input
                      label="Location"
                      value={edu.location || 'Surat, Gujarat'}
                      onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                      placeholder="e.g. Surat, Gujarat"
                    />
                  </div>

                  <div>
                    <Input
                      label="Period (Display Range)"
                      value={edu.period}
                      onChange={(e) => handleEducationChange(edu.id, 'period', e.target.value)}
                      placeholder="e.g. 2017 - 2018"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div>
                    <Input
                      label="Start Date"
                      value={edu.startDate || ''}
                      onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                      placeholder="e.g. 2017"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div>
                    <Input
                      label="End Date"
                      value={edu.endDate || ''}
                      onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                      placeholder="e.g. 2018"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Textarea
                      label="Description & Scope"
                      rows={2}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SUBSECTION 5: SKILLS EDITOR (DESIGN) */}
      {activeTab === 'skills' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span>Design Disciplines & Capabilities</span>
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              Core design specializations (Wireframes & Flows, Prototyping, UI, Interaction Design).
            </CardDescription>
          </div>

          <div className="space-y-4">
            {/* Input to Add New Skill */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDesignSkill())}
                  placeholder="e.g. Wireframes & Flows, Interaction Design..."
                  className="font-mono text-xs"
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleAddDesignSkill}
                disabled={!newSkillName.trim()}
              >
                Add Skill
              </Button>
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
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDesignSkill(index, 'down')}
                      disabled={index === (designCategory?.items || designCategory?.skills || []).length - 1}
                      className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSkillVisibility(skill.name)}
                      className={`p-1 text-xs ${
                        skill.visible !== false ? 'text-emerald-500' : 'text-muted opacity-40'
                      }`}
                      title={skill.visible !== false ? 'Visible' : 'Hidden'}
                      aria-label={skill.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {skill.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDesignSkill(skill.name)}
                      className="p-1 text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 6: DESIGN TOOLS EDITOR */}
      {activeTab === 'tools' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="w-4 h-4 text-foreground" />
              <span>Design Tools & Technical Stack</span>
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              Tools and technologies (Figma, Adobe XD, Photoshop, Illustrator, HTML/CSS, JavaScript, Bootstrap, GitHub).
            </CardDescription>
          </div>

          <div className="space-y-4">
            {/* Input to Add New Tool */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                  placeholder="e.g. Figma, Adobe Illustrator, GitHub..."
                  className="font-mono text-xs"
                />
              </div>
              <select
                value={newToolCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewToolCategory(e.target.value as 'Design Tools' | 'Technical')
                }
                className="px-3 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground"
              >
                <option value="Design Tools">Design Tools</option>
                <option value="Technical">Technical</option>
              </select>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleAddTool}
                disabled={!newToolName.trim()}
              >
                Add Tool
              </Button>
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
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveTool(idx, 'down')}
                      disabled={idx === toolsList.length - 1}
                      className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTool(tool.id)}
                      className="p-1 text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 7: SOCIAL LINKS EDITOR */}
      {activeTab === 'social' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 className="w-4 h-4 text-foreground" />
              <span>Social Links Directory</span>
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              LinkedIn, Dribbble, Behance, and Instagram profiles.
            </CardDescription>
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

              <div className="sm:col-span-6">
                <Input
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/dsbhuva"
                  className="font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleAddSocialLink}
                  disabled={!newSocialUrl.trim()}
                  className="w-full"
                >
                  Add Link
                </Button>
              </div>
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
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSocialLink(idx, 'down')}
                      disabled={idx === socialLinks.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-20"
                      title="Move Down"
                      aria-label="Move Down"
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
                      aria-label={soc.visible !== false ? 'Visible' : 'Hidden'}
                    >
                      {soc.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(idx)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 8: PROFILE IMAGE & VISUAL SPECIMENS */}
      {activeTab === 'image' && (
        <Card className="p-6 sm:p-8 space-y-8">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="w-4 h-4 text-foreground" />
              <span>Profile Photo & Cover Artifact</span>
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              Manage resume profile headshot, media uploads, and portfolio cover specimen.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Profile Headshot */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Profile Photograph (Resume)
                </span>
                <Badge variant="neutral" size="sm" className="font-mono">
                  [1200 × 1200]
                </Badge>
              </div>

              <div className="w-full aspect-square max-w-[240px] mx-auto overflow-hidden rounded-xl border border-border bg-surface shadow-md">
                <img
                  src={profileForm.profileImage || '/images/darshil-profile.jpg'}
                  alt="Profile"
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMediaTarget('profile');
                    fileInputRef.current?.click();
                  }}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setMediaTarget('profile');
                    setIsMediaPickerOpen(true);
                  }}
                  leftIcon={<Layers className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Choose Media
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleProfileChange('profileImage', '')}
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* 2. Cover / Portfolio Visual Specimen */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Cover / Specimen Artifact
                </span>
                <Badge variant="neutral" size="sm" className="font-mono">
                  [4032 × 2268]
                </Badge>
              </div>

              <div className="w-full aspect-video max-w-[320px] mx-auto overflow-hidden rounded-xl border border-border bg-surface shadow-md">
                <img
                  src={profileForm.coverImage || '/images/darshil-cover.png'}
                  alt="Cover Artifact"
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMediaTarget('cover');
                    fileInputRef.current?.click();
                  }}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setMediaTarget('cover');
                    setIsMediaPickerOpen(true);
                  }}
                  leftIcon={<Layers className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Choose Media
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 9: PHILOSOPHY EDITOR */}
      {activeTab === 'philosophy' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Compass className="w-4 h-4 text-foreground" />
                <span>Design Philosophy Statement</span>
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Editable design philosophy thesis, typographic line breaks, and author attribution.
              </CardDescription>
            </div>
            {philosophyForm.placeholder && (
              <Badge variant="warning" size="sm">
                Default Content
              </Badge>
            )}
          </div>

          {/* Editable Statement Notice */}
          <Alert variant="info" title="Editable Default Philosophy">
            The resume emphasizes utility, ease of use, and pleasure in product interaction. The default editable statement is <span className="font-semibold text-foreground">"Design should make complex things feel simple."</span> You can edit or refine this statement at any time.
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Main Statement */}
            <div className="md:col-span-2">
              <Textarea
                label="Main Philosophy Statement"
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
                className="font-bold text-sm"
              />
            </div>

            {/* Typographic Line 1 */}
            <div>
              <Input
                label="Display Headline Line 1"
                value={philosophyForm.line1 || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({ ...prev, line1: e.target.value }));
                }}
                placeholder="Design should make"
              />
            </div>

            {/* Typographic Line 2 */}
            <div>
              <Input
                label="Display Headline Line 2 (Indented)"
                value={philosophyForm.line2 || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({ ...prev, line2: e.target.value }));
                }}
                placeholder="complex things"
              />
            </div>

            {/* Typographic Line 3 */}
            <div>
              <Input
                label="Display Headline Line 3"
                value={philosophyForm.line3 || ''}
                onChange={(e) => {
                  markDirty();
                  setPhilosophyForm((prev) => ({ ...prev, line3: e.target.value }));
                }}
                placeholder="feel simple."
              />
            </div>

            {/* Author Attribution */}
            <div>
              <Input
                label="Author Attribution"
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
                className="font-mono uppercase text-xs"
              />
            </div>
          </div>
        </Card>
      )}

      {/* SUBSECTION 10: MARQUEE STRIP EDITOR */}
      {activeTab === 'marquee' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Repeat className="w-4 h-4 text-foreground" />
                <span>Kinetic Marquee Typography</span>
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Manage moving ticker phrases, velocity animation, and separator tokens.
              </CardDescription>
            </div>
            {marqueeForm.placeholder && (
              <Badge variant="warning" size="sm">
                Default Content
              </Badge>
            )}
          </div>

          {/* Marquee Add New Item Bar */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="flex-1">
              <Input
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
                className="font-bold uppercase text-xs"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
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
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Phrase
            </Button>
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
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
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
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
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
                      aria-label="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Speed & Separator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
            <div>
              <Input
                label="Loop Duration (Seconds)"
                type="number"
                min={10}
                max={120}
                value={marqueeForm.speed || 30}
                onChange={(e) => {
                  markDirty();
                  setMarqueeForm((prev) => ({ ...prev, speed: Number(e.target.value) || 30 }));
                }}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <Input
                label="Separator Token"
                type="text"
                value={marqueeForm.separator || '✦'}
                onChange={(e) => {
                  markDirty();
                  setMarqueeForm((prev) => ({ ...prev, separator: e.target.value }));
                }}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">Movement Direction</label>
              <select
                value={marqueeForm.direction || 'left'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
        </Card>
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
