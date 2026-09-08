import { SkillCategory, SkillItem } from '../types';
import { defaultWebsiteData } from './defaultWebsiteData';

export type { SkillCategory, SkillItem };

export const skillCategories: SkillCategory[] = defaultWebsiteData.skills;

export default skillCategories;

