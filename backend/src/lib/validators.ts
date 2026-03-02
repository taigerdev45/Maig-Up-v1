import { z } from 'zod';

// === Content Schemas ===

export const heroSchema = z.object({
  titleLine1: z.string().min(1).max(200),
  titleLine2: z.string().min(1).max(200),
  titleLine3: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  badges: z.array(z.string().max(200)).optional(),
});

export const statsItemSchema = z.object({
  icon: z.string().max(50).optional(),
  value: z.union([z.string(), z.number()]),
  label: z.string().min(1).max(200),
});

export const statsSchema = z.object({
  items: z.array(statsItemSchema),
});

export const serviceItemSchema = z.object({
  icon: z.string().max(50).optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  features: z.array(z.string().max(200)).optional(),
  color: z.string().max(50).optional(),
});

export const servicesSchema = z.object({
  items: z.array(serviceItemSchema),
});

export const testimonialItemSchema = z.object({
  name: z.string().min(1).max(200),
  quote: z.string().min(1).max(2000),
  country: z.string().max(100).optional(),
  origin: z.string().max(100).optional(),
  university: z.string().max(200).optional(),
  program: z.string().max(200).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  status: z.enum(['pending', 'published', 'rejected']).optional(),
});

export const testimonialsSchema = z.object({
  items: z.array(testimonialItemSchema),
});

export const whyUsItemSchema = z.object({
  icon: z.string().max(50).optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

export const whyUsSchema = z.object({
  items: z.array(whyUsItemSchema),
});

export const settingsSchema = z.object({
  siteName: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  address: z.string().max(500).optional(),
  whatsappMessage: z.string().max(500).optional(),
  darkModeAuto: z.boolean().optional(),
  scrollAnimations: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  notifyNewRegistration: z.boolean().optional(),
  notifyWeeklySummary: z.boolean().optional(),
}).passthrough();

export const contentSchemaMap: Record<string, z.ZodSchema> = {
  hero: heroSchema,
  stats: statsSchema,
  services: servicesSchema,
  testimonials: testimonialsSchema,
  whyUs: whyUsSchema,
  settings: settingsSchema,
};

// === Contact Schema ===

export const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional().default(''),
  country: z.string().max(100).optional().default(''),
  service: z.string().max(200).optional().default(''),
  message: z.string().min(1).max(5000),
});

export const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'treated']),
});

// === Registration Schema ===

export const registrationSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional().default(''),
  country: z.string().min(1).max(100),
  program: z.string().min(1).max(200),
  message: z.string().max(5000).optional().default(''),
});

export const registrationStatusSchema = z.object({
  status: z.enum(['En attente', 'En cours', 'Validé', 'Incomplet']),
});

// === Testimonial Submission Schema ===

export const testimonialSubmitSchema = z.object({
  name: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  quote: z.string().min(10).max(2000),
  university: z.string().max(200).optional().default(''),
  program: z.string().max(200).optional().default(''),
});

// === User Schema ===

export const createUserSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(200),
  role: z.enum(['ADMIN', 'EDITOR', 'READER']),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR', 'READER']),
});
