import { clientConfigSchema } from './schema';
import { transformConfig } from './mapper';
import type { UIConfig } from './types';

// Raw client data for Iron Pulse Gym
const rawIronPulseConfig = {
  siteName: 'Iron Pulse Gym',
  tagline: 'Transforma tu cuerpo, transforma tu vida',
  description:
    'Un gimnasio boutique dedicado al entrenamiento personalizado de alta calidad. Equipamiento de última generación y entrenadores certificados para ayudarte a alcanzar tus metas fitness.',
  theme: {
    primary: '#121212',
    accent: '#FF9F1C',
    background: '#FFFFFF',
    text: '#121212',
  },
  contact: {
    phone: '+54 11 1234-5678',
    email: 'contact@ironpulsegym.com',
    address: 'Av. Corrientes 1234, Buenos Aires',
    googleMapsLink: 'https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires',
    businessHours: 'Lunes a Viernes: 6:00 - 22:00 | Sábados: 8:00 - 18:00',
  },
  social: {
    instagram: 'https://instagram.com/ironpulsegym',
    facebook: 'https://facebook.com/ironpulsegym',
    twitter: undefined,
  },
  services: [
    {
      title: 'Entrenamiento Personal',
      description: 'Sesiones 1 a 1 con entrenadores certificados adaptadas a tus objetivos específicos.',
    },
    {
      title: 'Clases Grupales',
      description: 'Yoga, Pilates, HIIT y más en un ambiente motivador y energético.',
    },
    {
      title: 'Nutrición Deportiva',
      description: 'Planes nutricionales personalizados para maximizar tus resultados.',
    },
    {
      id: 'strength-training',
      title: 'Entrenamiento de Fuerza',
      description: 'Programas especializados en hipertrofia y fuerza con equipamiento profesional.',
    },
  ],
};

// Validate raw config against Zod schema
const validationResult = clientConfigSchema.safeParse(rawIronPulseConfig);

if (!validationResult.success) {
  console.error('❌ FATAL: Site configuration validation failed:');
  console.error(validationResult.error.issues);
  throw new Error(
    'Site configuration validation failed. The build cannot proceed with invalid configuration data.'
  );
}

// Transform validated config through the Boundary Layer
const processedConfig: UIConfig = transformConfig(validationResult.data);

// Export the final, validated, and transformed configuration
export const siteConfig: UIConfig = processedConfig;

// Export the type for use in components
export type { UIConfig } from './types';
