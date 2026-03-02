"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const content_1 = __importDefault(require("./routes/content"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const registrations_1 = __importDefault(require("./routes/registrations"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const visits_1 = __importDefault(require("./routes/visits"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : undefined;
app.use((0, cors_1.default)(allowedOrigins ? {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
} : undefined));
app.use(express_1.default.json());
// Rate limiting on public POST routes
const publicPostLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Apply rate limiter to public POST endpoints before routes
app.use('/api/contacts', (req, res, next) => {
    if (req.method === 'POST')
        return publicPostLimiter(req, res, next);
    next();
});
app.use('/api/registrations', (req, res, next) => {
    if (req.method === 'POST')
        return publicPostLimiter(req, res, next);
    next();
});
app.use('/api/testimonials', (req, res, next) => {
    if (req.method === 'POST')
        return publicPostLimiter(req, res, next);
    next();
});
app.use('/api/visits', (req, res, next) => {
    if (req.method === 'POST')
        return publicPostLimiter(req, res, next);
    next();
});
// Routes
app.use('/api/content', content_1.default);
app.use('/api/contacts', contacts_1.default);
app.use('/api/registrations', registrations_1.default);
app.use('/api/testimonials', testimonials_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/visits', visits_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
