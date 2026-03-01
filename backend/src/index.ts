import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contentRoutes from './routes/content';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/content', contentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
