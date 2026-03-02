import { Router } from 'express';
import { db } from '../config/firebase-admin';
import { checkAdmin } from '../middleware/auth';

const router = Router();

// Public: Record a page visit
router.post('/', async (req, res) => {
  try {
    const { page } = req.body;
    if (!page || typeof page !== 'string') {
      res.status(400).json({ error: 'Missing page field' });
      return;
    }

    await db.collection('visits').add({
      page,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Visit recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Admin: Get visit stats grouped by page and filtered by period
router.get('/stats', checkAdmin, async (req, res) => {
  try {
    const period = (req.query.period as string) || '7d';

    const now = new Date();
    let since: Date;
    switch (period) {
      case '24h':
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const sinceISO = since.toISOString();

    const snapshot = await db.collection('visits')
      .where('timestamp', '>=', sinceISO)
      .get();

    const byPage: Record<string, number> = {};
    const byDay: Record<string, Record<string, number>> = {};
    let total = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const page = data.page as string;
      const day = (data.timestamp as string).slice(0, 10); // YYYY-MM-DD

      byPage[page] = (byPage[page] || 0) + 1;
      total++;

      if (!byDay[day]) byDay[day] = {};
      byDay[day][page] = (byDay[day][page] || 0) + 1;
    });

    // Build sorted daily timeline
    const days = Object.keys(byDay).sort();
    const pages = Object.keys(byPage).sort();
    const timeline = days.map(day => ({
      date: day,
      ...pages.reduce((acc, p) => ({ ...acc, [p]: byDay[day][p] || 0 }), {} as Record<string, number>),
    }));

    res.json({ total, byPage, timeline, pages, period });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visit stats' });
  }
});

export default router;
