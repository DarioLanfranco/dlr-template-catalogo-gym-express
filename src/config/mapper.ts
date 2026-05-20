import type { UIConfig, Service } from './types';
import type { ClientConfigInput } from './schema';

/**
 * Sanitize string by trimming whitespace and escaping potentially dangerous characters
 */
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .replace(/[<>]/g, ''); // Remove angle brackets to prevent XSS
}

/**
 * Generate a secure slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Normalize business hours to a standard format
 */
function normalizeBusinessHours(hours: string): string {
  // Basic normalization: trim and capitalize first letter
  return sanitizeString(hours)
    .split(' ')
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ');
}

/**
 * Ensure URL uses HTTPS protocol
 */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }
  if (!trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Transform raw config through the Boundary Layer
 * This pure function sanitizes, normalizes, and enriches the data
 */
export function transformConfig(rawConfig: ClientConfigInput): UIConfig {
  // Sanitize basic strings
  const siteName = sanitizeString(rawConfig.siteName);
  const tagline = sanitizeString(rawConfig.tagline);
  const description = sanitizeString(rawConfig.description);

  // Process services with slug generation and fallback
  const services: Service[] =
    rawConfig.services.length > 0
      ? rawConfig.services.map((service) => ({
          id: service.id || generateSlug(service.title),
          title: sanitizeString(service.title),
          description: sanitizeString(service.description),
          image: sanitizeString(service.image),
        }))
      : [
          {
            id: 'service-placeholder',
            title: 'Próximamente',
            description: 'Nuestros servicios estarán disponibles pronto. Contáctanos para más información.',
            image: '',
          },
        ];

  // Normalize contact information
  const contact = {
    phone: sanitizeString(rawConfig.contact.phone),
    email: sanitizeString(rawConfig.contact.email),
    address: sanitizeString(rawConfig.contact.address),
    googleMapsLink: sanitizeUrl(rawConfig.contact.googleMapsLink),
    businessHours: normalizeBusinessHours(rawConfig.contact.businessHours),
    whatsappNumber: sanitizeString(rawConfig.contact.whatsappNumber),
  };

  // Process social links (sanitize URLs if present)
  const social = {
    instagram: rawConfig.social.instagram ? sanitizeUrl(rawConfig.social.instagram) : undefined,
    facebook: rawConfig.social.facebook ? sanitizeUrl(rawConfig.social.facebook) : undefined,
    twitter: rawConfig.social.twitter ? sanitizeUrl(rawConfig.social.twitter) : undefined,
  };

  // Theme colors are already validated by Zod, just pass through
  const theme = {
    primary: rawConfig.theme.primary,
    accent: rawConfig.theme.accent,
    background: rawConfig.theme.background,
    text: rawConfig.theme.text,
  };

  // Process about section
  const about = {
    history: {
      title: sanitizeString(rawConfig.about.history.title),
      subtitle: sanitizeString(rawConfig.about.history.subtitle),
      text1: sanitizeString(rawConfig.about.history.text1),
      text2: sanitizeString(rawConfig.about.history.text2),
      image: sanitizeString(rawConfig.about.history.image),
    },
    mission: {
      title: sanitizeString(rawConfig.about.mission.title),
      text: sanitizeString(rawConfig.about.mission.text),
      image: sanitizeString(rawConfig.about.mission.image),
    },
  };

  return {
    siteName,
    tagline,
    description,
    theme,
    contact,
    social,
    services,
    about,
  };
}
