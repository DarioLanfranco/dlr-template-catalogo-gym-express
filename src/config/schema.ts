import { z } from 'zod';

// Hex color validation: # followed by exactly 6 valid hex characters
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color in format #RRGGBB',
  });

// URL validation for links
const urlSchema = z
  .string()
  .url({ message: 'Must be a valid URL' })
  .refine((url) => url.startsWith('https://'), {
    message: 'URL must use HTTPS protocol',
  });

// Service schema with optional id (will be generated in mapper if missing)
const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Service title cannot be empty'),
  description: z.string().min(1, 'Service description cannot be empty'),
  image: z.string().min(1, 'Service image cannot be empty'),
});

// Theme schema
const themeSchema = z.object({
  primary: hexColorSchema,
  accent: hexColorSchema,
  background: hexColorSchema,
  text: hexColorSchema,
});

// Contact schema
const contactSchema = z.object({
  phone: z.string().min(1, 'Phone number cannot be empty'),
  email: z.string().email('Must be a valid email address'),
  address: z.string().min(1, 'Address cannot be empty'),
  googleMapsLink: urlSchema,
  businessHours: z.string().min(1, 'Business hours cannot be empty'),
  whatsappNumber: z.string().min(1, 'WhatsApp number cannot be empty'),
});

// Social schema (all fields optional)
const socialSchema = z.object({
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
});

// History schema
const historySchema = z.object({
  title: z.string().min(1, 'History title cannot be empty'),
  subtitle: z.string().min(1, 'History subtitle cannot be empty'),
  text1: z.string().min(1, 'History text1 cannot be empty'),
  text2: z.string().min(1, 'History text2 cannot be empty'),
  image: z.string().min(1, 'History image cannot be empty'),
});

// Mission schema
const missionSchema = z.object({
  title: z.string().min(1, 'Mission title cannot be empty'),
  text: z.string().min(1, 'Mission text cannot be empty'),
  image: z.string().min(1, 'Mission image cannot be empty'),
});

// About schema
const aboutSchema = z.object({
  history: historySchema,
  mission: missionSchema,
});

// Main client config schema for raw input validation
export const clientConfigSchema = z.object({
  siteName: z.string().min(1, 'Site name cannot be empty'),
  tagline: z.string().min(1, 'Tagline cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  theme: themeSchema,
  contact: contactSchema,
  social: socialSchema,
  services: z.array(serviceSchema).min(0, 'Services array is required'),
  about: aboutSchema,
});

export type ClientConfigInput = z.infer<typeof clientConfigSchema>;
