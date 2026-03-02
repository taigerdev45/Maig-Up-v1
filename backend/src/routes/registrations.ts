import { Router } from 'express';
import { db } from '../config/firebase-admin';
import { checkAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registrationSchema, registrationStatusSchema } from '../lib/validators';

const router = Router();

// Public: Submit registration
router.post('/', validate(registrationSchema), async (req, res) => {
  try {
    const registration = {
      ...req.body,
      status: 'En attente',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('registrations').add(registration);
    res.status(201).json({ id: docRef.id, message: 'Registration submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit registration' });
  }
});

// Admin: List registrations
router.get('/', checkAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const snapshot = await db.collection('registrations').orderBy('createdAt', 'desc').get();
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const total = all.length;
    const paginated = all.slice((page - 1) * limit, page * limit);

    res.json({ data: paginated, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Admin: Update registration status
router.put('/:id/status', checkAdmin, validate(registrationStatusSchema), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('registrations').doc(id).update({ status: req.body.status });
    res.json({ message: 'Registration status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update registration status' });
  }
});

// Admin: Delete registration
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('registrations').doc(id).delete();
    res.json({ message: 'Registration deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

export default router;
