import { clientConfigSchema, type ClientConfigInput } from "./schema";
import { transformConfig } from "./mapper";
import type { UIConfig } from "./types";

// Raw client data for Iron Pulse Gym
const rawIronPulseConfig = {
  siteName: "Iron Pulse Gym",
  tagline: "Transforma tu cuerpo, transforma tu vida",
  description:
    "Un gimnasio boutique dedicado al entrenamiento personalizado de alta calidad. Equipamiento de última generación y entrenadores certificados para ayudarte a alcanzar tus metas fitness.",
  theme: {
    primary: "#121212",
    accent: "#FF9F1C",
    background: "#FFFFFF",
    text: "#121212",
  },
  contact: {
    phone: "+5493584201263",
    email: "dariolanfrancoruffener@gmail.com",
    address: "Av. Corrientes 1234, Buenos Aires",
    googleMapsLink:
      "https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires",
    businessHours: "Lunes a Viernes: 6:00 - 22:00 | Sábados: 8:00 - 18:00",
    whatsappNumber: "+5493584201263",
  },
  social: {
    instagram: "https://instagram.com/ironpulsegym",
    facebook: "https://facebook.com/ironpulsegym",
    twitter: undefined,
  },
  services: [
    {
      title: "Entrenamiento Personal",
      description:
        "Sesiones 1 a 1 con entrenadores certificados adaptadas a tus objetivos específicos.",
      image: "coachs1.webp",
    },
    {
      title: "Clases Grupales",
      description:
        "Yoga, Pilates, HIIT y más en un ambiente motivador y energético.",
      image: "spinning1.webp",
    },
    {
      title: "Nutrición Deportiva",
      description:
        "Planes nutricionales personalizados para maximizar tus resultados.",
      image: "pilates1.webp",
    },
    {
      id: "strength-training",
      title: "Entrenamiento de Fuerza",
      description:
        "Programas especializados en hipertrofia y fuerza con equipamiento profesional.",
      image: "gym12.webp",
    },
  ],
  about: {
    history: {
      title: "Nuestra Historia",
      subtitle: "Desde 2015 transformando vidas",
      text1: "Iron Pulse Gym nació de la pasión por el fitness y el deseo de crear un espacio donde cada persona pudiera alcanzar su máximo potencial. Comenzamos como un pequeño estudio de entrenamiento personal en el corazón de Buenos Aires.",
      text2: "Hoy, somos un referente en la industria del fitness, con equipamiento de última generación y un equipo de entrenadores certificados comprometidos con tu éxito. Nuestra filosofía se basa en el entrenamiento personalizado, la nutrición inteligente y un ambiente motivador.",
      image: "coachs1.webp",
    },
    mission: {
      title: "Nuestra Misión",
      text: "Transformar vidas a través del fitness de alta calidad, proporcionando entrenamiento personalizado, nutrición deportiva y un ambiente motivador que impulse a cada miembro a alcanzar sus metas y superar sus límites.",
      image: "gym12.webp",
    },
  },
} satisfies ClientConfigInput;

// Validate raw config against Zod schema
const validationResult = clientConfigSchema.safeParse(rawIronPulseConfig);

if (!validationResult.success) {
  console.error("❌ FATAL: Site configuration validation failed:");
  console.error(validationResult.error.issues);
  throw new Error(
    "Site configuration validation failed. The build cannot proceed with invalid configuration data.",
  );
}

// Transform validated config through the Boundary Layer
const processedConfig: UIConfig = transformConfig(validationResult.data);

// Export the final, validated, and transformed configuration
export const siteConfig: UIConfig = processedConfig;

// Export the type for use in components
export type { UIConfig } from "./types";
