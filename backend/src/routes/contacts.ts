import { Router } from 'express';
import { db } from '../config/firebase-admin';
import { checkAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { contactSchema, contactStatusSchema } from '../lib/validators';
import { sendContactEmail } from '../lib/email';

const router = Router();

// Public: Submit contact form
router.post('/', validate(contactSchema), async (req, res) => {
  try {
    const contact = {
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('contacts').add(contact);
    
    // Send email notification (fire and forget, or wait?)
    // Waiting is safer for debugging, but slower for user.
    // Given the user wants to "prepare environment", making it work is key.
    // We'll await it but catch errors so form submission doesn't fail if email fails.
    try {
      await sendContactEmail(req.body);
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError);
      // We continue even if email fails, as the contact is saved in DB.
    }

    res.status(201).json({ id: docRef.id, message: 'Contact submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ error: 'Failed to submit contact' });
  }
});

// Admin: List contacts
router.get('/', checkAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('contacts').orderBy('createdAt', 'desc').get();
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Admin: Update contact status
router.put('/:id/status', checkAdmin, validate(contactStatusSchema), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('contacts').doc(id).update({ status: req.body.status });
    res.json({ message: 'Contact status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

// Admin: Delete contact
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('contacts').doc(id).delete();
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;
