import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import contentRoutes from './routes/content';
import contactsRoutes from './routes/contacts';
import registrationsRoutes from './routes/registrations';
import testimonialsRoutes from './routes/testimonials';
import dashboardRoutes from './routes/dashboard';
import visitsRoutes from './routes/visits';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security Headers
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : undefined;

app.use(cors(allowedOrigins ? {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
} : undefined));

app.use(express.json());

// Rate limiting on public POST routes
const publicPostLimiter = rateLimit({
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
  if (req.method === 'POST') return publicPostLimiter(req, res, next);
  next();
});
app.use('/api/registrations', (req, res, next) => {
  if (req.method === 'POST') return publicPostLimiter(req, res, next);
  next();
});
app.use('/api/testimonials', (req, res, next) => {
  if (req.method === 'POST') return publicPostLimiter(req, res, next);
  next();
});
app.use('/api/visits', (req, res, next) => {
  if (req.method === 'POST') return publicPostLimiter(req, res, next);
  next();
});

// Routes
app.use('/api/content', contentRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/visits', visitsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
