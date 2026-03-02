import { Router } from 'express';
import { db } from '../config/firebase-admin';
import { checkAdmin } from '../middleware/auth';

const router = Router();

// Admin: Get dashboard stats
router.get('/stats', checkAdmin, async (req, res) => {
  try {
    const [contactsSnap, registrationsSnap, testimonialsSnap] = await Promise.all([
      db.collection('contacts').get(),
      db.collection('registrations').get(),
      db.collection('testimonials_submissions').get(),
    ]);

    const registrations = registrationsSnap.docs.map(doc => doc.data());
    const contacts = contactsSnap.docs.map(doc => doc.data());

    const registrationsByStatus: Record<string, number> = {
      'Validé': 0,
      'En attente': 0,
      'En cours': 0,
      'Incomplet': 0,
    };
    registrations.forEach(r => {
      const status = r.status as string;
      if (status in registrationsByStatus) {
        registrationsByStatus[status]++;
      }
    });

    const contactsByStatus: Record<string, number> = {
      new: 0,
      read: 0,
      treated: 0,
    };
    contacts.forEach(c => {
      const status = c.status as string;
      if (status in contactsByStatus) {
        contactsByStatus[status]++;
      }
    });

    res.json({
      totalContacts: contactsSnap.size,
      totalRegistrations: registrationsSnap.size,
      totalTestimonials: testimonialsSnap.size,
      registrationsByStatus,
      contactsByStatus,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Admin: Get contacts & registrations evolution timeline
router.get('/evolution', checkAdmin, async (req, res) => {
  try {
    const period = (req.query.period as string) || '30d';

    const now = new Date();
    let since: Date;
    switch (period) {
      case '7d':
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '12m':
        since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const sinceISO = since.toISOString();

    const [contactsSnap, registrationsSnap] = await Promise.all([
      db.collection('contacts').where('createdAt', '>=', sinceISO).get(),
      db.collection('registrations').where('createdAt', '>=', sinceISO).get(),
    ]);

    // Group by day (or month for 12m)
    const useMonth = period === '12m';
    const byKey: Record<string, { contacts: number; registrations: number }> = {};

    // Pre-fill all days/months in range
    const cursor = new Date(since);
    while (cursor <= now) {
      const key = useMonth
        ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
        : cursor.toISOString().slice(0, 10);
      byKey[key] = { contacts: 0, registrations: 0 };
      if (useMonth) {
        cursor.setMonth(cursor.getMonth() + 1);
      } else {
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    contactsSnap.docs.forEach(doc => {
      const ts = doc.data().createdAt as string;
      const key = useMonth ? ts.slice(0, 7) : ts.slice(0, 10);
      if (byKey[key]) byKey[key].contacts++;
    });

    registrationsSnap.docs.forEach(doc => {
      const ts = doc.data().createdAt as string;
      const key = useMonth ? ts.slice(0, 7) : ts.slice(0, 10);
      if (byKey[key]) byKey[key].registrations++;
    });

    const timeline = Object.entries(byKey)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({ date, ...counts }));

    res.json({ timeline, period });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch evolution data' });
  }
});

export default router;
