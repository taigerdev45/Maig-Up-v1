"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.createUserSchema = exports.testimonialSubmitSchema = exports.registrationStatusSchema = exports.registrationSchema = exports.contactStatusSchema = exports.contactSchema = exports.contentSchemaMap = exports.settingsSchema = exports.whyUsSchema = exports.whyUsItemSchema = exports.testimonialsSchema = exports.testimonialItemSchema = exports.servicesSchema = exports.serviceItemSchema = exports.statsSchema = exports.statsItemSchema = exports.heroSchema = void 0;
const zod_1 = require("zod");
// === Content Schemas ===
exports.heroSchema = zod_1.z.object({
    titleLine1: zod_1.z.string().min(1).max(200),
    titleLine2: zod_1.z.string().min(1).max(200),
    titleLine3: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(1000),
    badges: zod_1.z.array(zod_1.z.string().max(200)).optional(),
});
exports.statsItemSchema = zod_1.z.object({
    icon: zod_1.z.string().max(50).optional(),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    label: zod_1.z.string().min(1).max(200),
});
exports.statsSchema = zod_1.z.object({
    items: zod_1.z.array(exports.statsItemSchema),
});
exports.serviceItemSchema = zod_1.z.object({
    icon: zod_1.z.string().max(50).optional(),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(1000),
    features: zod_1.z.array(zod_1.z.string().max(200)).optional(),
    color: zod_1.z.string().max(50).optional(),
});
exports.servicesSchema = zod_1.z.object({
    items: zod_1.z.array(exports.serviceItemSchema),
});
exports.testimonialItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    quote: zod_1.z.string().min(1).max(2000),
    country: zod_1.z.string().max(100).optional(),
    origin: zod_1.z.string().max(100).optional(),
    university: zod_1.z.string().max(200).optional(),
    program: zod_1.z.string().max(200).optional(),
    avatar: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    status: zod_1.z.enum(['pending', 'published', 'rejected']).optional(),
});
exports.testimonialsSchema = zod_1.z.object({
    items: zod_1.z.array(exports.testimonialItemSchema),
});
exports.whyUsItemSchema = zod_1.z.object({
    icon: zod_1.z.string().max(50).optional(),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(1000),
});
exports.whyUsSchema = zod_1.z.object({
    items: zod_1.z.array(exports.whyUsItemSchema),
});
exports.settingsSchema = zod_1.z.object({
    siteName: zod_1.z.string().max(200).optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().max(30).optional(),
    address: zod_1.z.string().max(500).optional(),
    whatsappMessage: zod_1.z.string().max(500).optional(),
    darkModeAuto: zod_1.z.boolean().optional(),
    scrollAnimations: zod_1.z.boolean().optional(),
    maintenanceMode: zod_1.z.boolean().optional(),
    notifyNewRegistration: zod_1.z.boolean().optional(),
    notifyWeeklySummary: zod_1.z.boolean().optional(),
}).passthrough();
exports.contentSchemaMap = {
    hero: exports.heroSchema,
    stats: exports.statsSchema,
    services: exports.servicesSchema,
    testimonials: exports.testimonialsSchema,
    whyUs: exports.whyUsSchema,
    settings: exports.settingsSchema,
};
// === Contact Schema ===
exports.contactSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email().max(200),
    phone: zod_1.z.string().max(30).optional().default(''),
    country: zod_1.z.string().max(100).optional().default(''),
    service: zod_1.z.string().max(200).optional().default(''),
    message: zod_1.z.string().min(1).max(5000),
});
exports.contactStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['new', 'read', 'treated']),
});
// === Registration Schema ===
exports.registrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    email: zod_1.z.string().email().max(200),
    phone: zod_1.z.string().max(30).optional().default(''),
    country: zod_1.z.string().min(1).max(100),
    program: zod_1.z.string().min(1).max(200),
    message: zod_1.z.string().max(5000).optional().default(''),
});
exports.registrationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['En attente', 'En cours', 'Validé', 'Incomplet']),
});
// === Testimonial Submission Schema ===
exports.testimonialSubmitSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    country: zod_1.z.string().min(1).max(100),
    quote: zod_1.z.string().min(10).max(2000),
    university: zod_1.z.string().max(200).optional().default(''),
    program: zod_1.z.string().max(200).optional().default(''),
});
// === User Schema ===
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(200),
    password: zod_1.z.string().min(6).max(100),
    name: zod_1.z.string().min(1).max(200),
    role: zod_1.z.enum(['ADMIN', 'EDITOR', 'READER']),
});
exports.updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'EDITOR', 'READER']),
});
