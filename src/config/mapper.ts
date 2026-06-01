import type { UIConfig, Service } from './types';
import type { ClientConfigInput } from './schema';

/**
 * ============================================================================
 * ADAPTER PATTERN — DATA BOUNDARY LAYER
 * ============================================================================
 * Transforma y normaliza datos externos (hoy archivo local, mañana un CMS
 * headless) antes de inyectarlos en componentes presentacionales.
 * La validación ya ocurrió en Zod — aquí solo se moldea el contrato UIConfig.
 * ============================================================================
 */

/**
 * Generate a secure slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Normalize business hours to a standard format
 */
function normalizeBusinessHours(hours: string): string {
  return hours
    .trim()
    .split(' ')
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
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

export function transformConfig(rawConfig: ClientConfigInput): UIConfig {
  const siteName = rawConfig.siteName;
  const tagline = rawConfig.tagline;
  const description = rawConfig.description;

  const services: Service[] =
    rawConfig.services.length > 0
      ? rawConfig.services.map((service) => ({
          id: service.id || generateSlug(service.title),
          title: service.title,
          description: service.description,
          image: service.image,
        }))
      : [
          {
            id: 'service-placeholder',
            title: 'Próximamente',
            description:
              'Nuestros servicios estarán disponibles pronto. Contáctanos para más información.',
            image: '',
          },
        ];

  const contact = {
    phone: rawConfig.contact.phone,
    email: rawConfig.contact.email,
    address: rawConfig.contact.address,
    googleMapsLink: sanitizeUrl(rawConfig.contact.googleMapsLink),
    businessHours: normalizeBusinessHours(rawConfig.contact.businessHours),
    whatsappNumber: rawConfig.contact.whatsappNumber,
  };

  const social = {
    instagram: rawConfig.social.instagram
      ? sanitizeUrl(rawConfig.social.instagram)
      : undefined,
    facebook: rawConfig.social.facebook
      ? sanitizeUrl(rawConfig.social.facebook)
      : undefined,
    twitter: rawConfig.social.twitter
      ? sanitizeUrl(rawConfig.social.twitter)
      : undefined,
  };

  const theme = {
    primary: rawConfig.theme.primary,
    accent: rawConfig.theme.accent,
    background: rawConfig.theme.background,
    text: rawConfig.theme.text,
  };

  const about = {
    history: {
      title: rawConfig.about.history.title,
      subtitle: rawConfig.about.history.subtitle,
      text1: rawConfig.about.history.text1,
      text2: rawConfig.about.history.text2,
      image: rawConfig.about.history.image,
    },
    mission: {
      title: rawConfig.about.mission.title,
      text: rawConfig.about.mission.text,
      image: rawConfig.about.mission.image,
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
