import { Router } from 'express';
import { db } from '../config/firebase-admin';
import { checkAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { contentSchemaMap } from '../lib/validators';

const router = Router();

// Public: Get all content components
router.get('/', async (req, res) => {
  try {
    const contentRef = db.collection('content');
    const snapshot = await contentRef.get();

    const content: Record<string, unknown> = {};
    snapshot.forEach(doc => {
      content[doc.id] = doc.data();
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Admin: Update content component (with optional validation)
router.put('/:id', checkAdmin, (req, res, next) => {
  const { id } = req.params;
  const schema = contentSchemaMap[id];
  if (schema) {
    return validate(schema)(req, res, next);
  }
  next();
}, async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    await db.collection('content').doc(id).set(newData, { merge: true });
    res.json({ message: `Content ${id} updated successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export default router;
