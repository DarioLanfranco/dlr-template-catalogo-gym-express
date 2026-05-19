export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface Theme {
  primary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Contact {
  phone: string;
  email: string;
  address: string;
  googleMapsLink: string;
  businessHours: string;
  whatsappNumber: string;
}

export interface Social {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface UIConfig {
  siteName: string;
  tagline: string;
  description: string;
  theme: Theme;
  contact: Contact;
  social: Social;
  services: Service[];
}
