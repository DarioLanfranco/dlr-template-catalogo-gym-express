import { describe, it, expect } from "vitest";
import { clientConfigSchema } from "../config/schema";
import { transformConfig } from "../config/mapper";
import type { ClientConfigInput } from "../config/schema";

const validPayload: ClientConfigInput = {
  siteName: "Iron Pulse Gym",
  tagline: "Transforma tu cuerpo, transforma tu vida",
  description: "Gimnasio boutique de entrenamiento personalizado.",
  theme: {
    primary: "#121212",
    accent: "#FF9F1C",
    background: "#FFFFFF",
    text: "#121212",
  },
  contact: {
    phone: "+5493584201263",
    email: "test@ironpulsegym.com",
    address: "Av. Corrientes 1234, Buenos Aires",
    googleMapsLink: "https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires",
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
      description: "Sesiones 1 a 1 con entrenadores certificados.",
      image: "coachs1.webp",
    },
  ],
  about: {
    history: {
      title: "Nuestra Historia",
      subtitle: "Desde 2015 transformando vidas",
      text1: "Iron Pulse Gym nació de la pasión por el fitness.",
      text2: "Hoy somos un referente en la industria del fitness.",
      image: "coachs1.webp",
    },
    mission: {
      title: "Nuestra Misión",
      text: "Transformar vidas a través del fitness de alta calidad.",
      image: "gym12.webp",
    },
  },
};

describe("clientConfigSchema", () => {
  it("accepts a valid payload", () => {
    const result = clientConfigSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects an empty object", () => {
    const result = clientConfigSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects a missing siteName", () => {
    const { siteName, ...rest } = validPayload;
    const result = clientConfigSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid hex color", () => {
    const payload = {
      ...validPayload,
      theme: { ...validPayload.theme, primary: "not-a-color" },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects a hex color without hash", () => {
    const payload = {
      ...validPayload,
      theme: { ...validPayload.theme, primary: "121212" },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects a short hex color", () => {
    const payload = {
      ...validPayload,
      theme: { ...validPayload.theme, accent: "#FFF" },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const payload = {
      ...validPayload,
      contact: { ...validPayload.contact, email: "not-an-email" },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects a non-https URL", () => {
    const payload = {
      ...validPayload,
      contact: {
        ...validPayload.contact,
        googleMapsLink: "http://maps.google.com",
      },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects a service with empty title", () => {
    const payload = {
      ...validPayload,
      services: [{ title: "", description: "desc", image: "img.webp" }],
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects a service with empty description", () => {
    const payload = {
      ...validPayload,
      services: [{ title: "Title", description: "", image: "img.webp" }],
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("accepts an empty services array", () => {
    const payload = {
      ...validPayload,
      services: [],
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("accepts a payload without social twitter", () => {
    const payload = {
      ...validPayload,
      social: { instagram: "https://instagram.com/test", facebook: "https://facebook.com/test" },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("rejects a history with empty title", () => {
    const payload = {
      ...validPayload,
      about: {
        ...validPayload.about,
        history: { title: "", subtitle: "sub", text1: "t1", text2: "t2", image: "img.webp" },
      },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects a mission with empty text", () => {
    const payload = {
      ...validPayload,
      about: {
        ...validPayload.about,
        mission: { title: "Title", text: "", image: "img.webp" },
      },
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe("transformConfig", () => {
  it("returns a complete UIConfig from valid input", () => {
    const result = clientConfigSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.siteName).toBe("Iron Pulse Gym");
    expect(config.tagline).toBe("Transforma tu cuerpo, transforma tu vida");
    expect(config.theme.primary).toBe("#121212");
    expect(config.theme.accent).toBe("#FF9F1C");
    expect(config.contact.email).toBe("test@ironpulsegym.com");
    expect(config.contact.googleMapsLink).toBe("https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires");
    expect(config.services).toHaveLength(1);
    expect(config.services[0].id).toBeDefined();
    expect(config.services[0].id).toBe("entrenamiento-personal");
    expect(config.about.history.title).toBe("Nuestra Historia");
    expect(config.about.mission.text).toBe("Transformar vidas a través del fitness de alta calidad.");
  });

  it("preserves multiple spaces in tagline", () => {
    const payload = {
      ...validPayload,
      tagline: "Transforma   tu   cuerpo",
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.tagline).toBe("Transforma   tu   cuerpo");
  });

  it("generates a slug for services without an id", () => {
    const payload = {
      ...validPayload,
      services: [
        { title: "Clases Grupales de Yoga", description: "Yoga para todos.", image: "yoga.webp" },
      ],
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.services[0].id).toBe("clases-grupales-de-yoga");
  });

  it("preserves a manually provided service id", () => {
    const payload = {
      ...validPayload,
      services: [
        { id: "custom-id", title: "Custom Service", description: "Desc", image: "img.webp" },
      ],
    };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.services[0].id).toBe("custom-id");
  });

  it("provides a placeholder service when services array is empty", () => {
    const payload = { ...validPayload, services: [] };
    const result = clientConfigSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.services).toHaveLength(1);
    expect(config.services[0].title).toBe("Próximamente");
    expect(config.services[0].id).toBe("service-placeholder");
  });

  it("preserves a valid https googleMapsLink", () => {
    const result = clientConfigSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.contact.googleMapsLink).toBe("https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires");
  });

  it("preserves social links when provided", () => {
    const result = clientConfigSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const config = transformConfig(result.data);
    expect(config.social.instagram).toBe("https://instagram.com/ironpulsegym");
    expect(config.social.facebook).toBe("https://facebook.com/ironpulsegym");
    expect(config.social.twitter).toBeUndefined();
  });


});
