/**
 * Centralized Validation and Data-Safety Utilities for SCRiLLO Admin Panel
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validators = {
  /**
   * Validate non-empty string for required fields
   */
  required(value?: string | null, fieldName = 'This field'): ValidationResult {
    if (!value || !value.trim()) {
      return {
        isValid: false,
        error: `${fieldName} is required and cannot be empty.`,
      };
    }
    return { isValid: true };
  },

  /**
   * Validate URL security and syntax
   * Strictly blocks javascript:, data:, and other dangerous execution protocols
   */
  url(url?: string | null, allowEmpty = true, fieldName = 'URL'): ValidationResult {
    if (!url || !url.trim()) {
      if (allowEmpty) return { isValid: true };
      return { isValid: false, error: `${fieldName} is required.` };
    }

    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();

    // Block dangerous protocols
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:') ||
      lower.includes('<script') ||
      lower.includes('onclick')
    ) {
      return {
        isValid: false,
        error: `${fieldName} contains an unsafe or prohibited script protocol.`,
      };
    }

    // Allow valid web protocols, mailto, relative paths and anchor links
    const isValidFormat =
      lower.startsWith('http://') ||
      lower.startsWith('https://') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('/') ||
      lower.startsWith('#') ||
      lower.startsWith('tel:');

    if (!isValidFormat) {
      return {
        isValid: false,
        error: `${fieldName} must start with https://, http://, mailto:, or a relative path (/).`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate RFC email format
   */
  email(email?: string | null, allowEmpty = true, fieldName = 'Email'): ValidationResult {
    if (!email || !email.trim()) {
      if (allowEmpty) return { isValid: true };
      return { isValid: false, error: `${fieldName} is required.` };
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!emailRegex.test(email.trim())) {
      return {
        isValid: false,
        error: `Please enter a valid ${fieldName} format (e.g. name@domain.com).`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate slug syntax (lowercase alphanumeric with hyphens)
   */
  slug(slug?: string | null, fieldName = 'Slug'): ValidationResult {
    if (!slug || !slug.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug.trim())) {
      return {
        isValid: false,
        error: `${fieldName} can only contain lowercase letters, numbers, and hyphens (e.g. "aurora-crm").`,
      };
    }

    return { isValid: true };
  },

  /**
   * Sanitize string into clean URL-friendly slug
   */
  sanitizeSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
  },

  /**
   * Check for duplicate slug across existing projects
   */
  uniqueSlug(
    slug: string,
    existingSlugs: string[],
    currentId?: string,
    idToSlugMap?: Map<string, string>
  ): ValidationResult {
    const trimmed = slug.trim().toLowerCase();
    
    // Check if slug is used by another project
    if (idToSlugMap && currentId) {
      for (const [id, existingSlug] of idToSlugMap.entries()) {
        if (id !== currentId && existingSlug.toLowerCase() === trimmed) {
          return {
            isValid: false,
            error: `The slug "${trimmed}" is already in use by another project. Slugs must be unique.`,
          };
        }
      }
    } else {
      const matchCount = existingSlugs.filter((s) => s.toLowerCase() === trimmed).length;
      if (matchCount > 0) {
        return {
          isValid: false,
          error: `The slug "${trimmed}" is already in use. Please choose a unique slug.`,
        };
      }
    }

    return { isValid: true };
  },

  /**
   * Validate positive integer order
   */
  order(value: any, fieldName = 'Order'): ValidationResult {
    const num = Number(value);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
      return {
        isValid: false,
        error: `${fieldName} must be a valid positive integer.`,
      };
    }
    return { isValid: true };
  },

  /**
   * Validate image file type and size limit (Default 10MB)
   */
  imageFile(
    file: File,
    maxSizeBytes = 10 * 1024 * 1024,
    allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
  ): ValidationResult {
    // 1. Check MIME type
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: `Unsupported image format "${file.name}". Supported formats: PNG, JPG, JPEG, WEBP, and SVG.`,
      };
    }

    // 2. Check File size
    if (file.size > maxSizeBytes) {
      const sizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      return {
        isValid: false,
        error: `File "${file.name}" exceeds the maximum allowed size of ${sizeMB}MB. Please compress your asset.`,
      };
    }

    return { isValid: true };
  },

  /**
   * Validate and sanitize homepage section layout settings
   */
  sectionSettings(sections: Record<string, any>): ValidationResult {
    if (!sections || typeof sections !== 'object') {
      return { isValid: false, error: 'Section settings must be a valid object mapping.' };
    }

    const seenOrders = new Set<number>();
    for (const [key, sec] of Object.entries(sections)) {
      if (!sec || typeof sec !== 'object') {
        return { isValid: false, error: `Invalid configuration for section "${key}".` };
      }
      if (typeof sec.visible !== 'boolean') {
        return { isValid: false, error: `Section "${key}" must have a boolean visible property.` };
      }
      if (typeof sec.order !== 'number' || !Number.isInteger(sec.order) || sec.order < 1) {
        return { isValid: false, error: `Section "${key}" must have a positive integer order.` };
      }
      if (seenOrders.has(sec.order)) {
        return { isValid: false, error: `Duplicate order ${sec.order} found in section settings.` };
      }
      seenOrders.add(sec.order);
    }

    return { isValid: true };
  },

  /**
   * Format friendly error messages from system or backend errors
   */
  formatFriendlyError(err: any): string {
    if (!err) return 'An unexpected error occurred. Please try again.';

    const msg = typeof err === 'string' ? err : err.message || '';
    const lower = msg.toLowerCase();

    if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('econnrefused')) {
      return 'Network connection issue. Your changes have been preserved in local cache and will sync once connected.';
    }

    if (lower.includes('duplicate key') || lower.includes('unique constraint') || lower.includes('23505')) {
      return 'A record with this identifier or slug already exists. Please choose a unique name.';
    }

    if (lower.includes('jwt') || lower.includes('token') || lower.includes('unauthorized') || lower.includes('401')) {
      return 'Your session has expired. Please log in again to save your changes.';
    }

    if (lower.includes('not found') || lower.includes('404')) {
      return 'The requested record could not be found. It may have been deleted or moved.';
    }

    if (lower.includes('storage') || lower.includes('bucket') || lower.includes('upload')) {
      return 'Storage upload error. The file has been stored in local session cache.';
    }

    if (msg.length > 0 && msg.length < 150) {
      return msg;
    }

    return 'Unable to complete the operation. Your changes are safely preserved in the editor.';
  },
};

export default validators;
