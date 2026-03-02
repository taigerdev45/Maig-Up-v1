export interface Hero {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  badges?: string[];
}

export interface StatItem {
  icon?: string;
  value: string | number;
  label: string;
}

export interface ServiceItem {
  icon?: string;
  title: string;
  description: string;
  features?: string[];
  color?: string;
}

export interface TestimonialItem {
  name: string;
  quote: string;
  country?: string;
  origin?: string;
  university?: string;
  program?: string;
  avatar?: string;
  status?: 'pending' | 'published' | 'rejected';
}

export interface WhyUsItem {
  icon?: string;
  title: string;
  description: string;
}

export interface Settings {
  siteName?: string;
  email?: string;
  phone?: string;
  address?: string;
  whatsappMessage?: string;
}

export interface SiteContent {
  hero?: Hero;
  stats?: { items: StatItem[] };
  services?: { items: ServiceItem[] };
  testimonials?: { items: TestimonialItem[] };
  whyUs?: { items: WhyUsItem[] };
  settings?: Settings;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'treated';
  createdAt: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  program: string;
  message?: string;
  status: 'En attente' | 'En cours' | 'Validé' | 'Incomplet';
  createdAt: string;
}

export interface DashboardStats {
  totalContacts: number;
  totalRegistrations: number;
  totalTestimonials: number;
  registrationsByStatus: Record<string, number>;
  contactsByStatus: Record<string, number>;
}
