import type { UIConfig, Service } from './types';
import type { ClientConfigInput } from './schema';

/**
 * ============================================================================
 * ADAPTER PATTERN — DATA BOUNDARY LAYER
 * ============================================================================
 * DEUDA TÉCNICA / FUTURE-PROOFING:
 *
 * Este archivo actúa como un adaptador (Pattern Adapter) que sanitiza,
 * normaliza y transforma datos externos (hoy un archivo local, mañana un
 * CMS headless como Strapi o Sanity, o una API REST) antes de inyectarlos
 * en los componentes presentacionales.
 *
 * Si mañana los datos se migran de un archivo local a un CMS headless o API:
 *   1. Solo se debe modificar este adaptador y el schema de validación.
 *   2. Los componentes presentacionales no necesitan cambios — ya reciben
 *      datos tipados y limpios vía props (Dependency Injection).
 *
 * Beneficios estratégicos:
 *   - Desacoplamiento total entre origen de datos y UI.
 *   - Un único punto de sanitización (XSS, normalización de URLs, etc.).
 *   - Validación temprana en build-time (Zod schema) antes de llegar a los
 *     templates.
 * ============================================================================
 */

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
