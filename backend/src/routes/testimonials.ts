import { Router } from 'express';
import { db } from '../config/firebase-admin';
import { validate } from '../middleware/validate';
import { testimonialSubmitSchema } from '../lib/validators';

const router = Router();

// Public: Submit a testimonial
router.post('/', validate(testimonialSubmitSchema), async (req, res) => {
  try {
    const testimonial = {
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('testimonials_submissions').add(testimonial);
    res.status(201).json({ id: docRef.id, message: 'Testimonial submitted for review' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

export default router;
