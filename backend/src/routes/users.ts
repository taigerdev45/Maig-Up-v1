import { Router } from 'express';
import { db, auth } from '../config/firebase-admin';
import { checkAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserRoleSchema } from '../lib/validators';

const router = Router();

// Admin: List users
router.get('/', checkAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Create user
router.post('/', checkAdmin, validate(createUserSchema), async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const userRecord = await auth.createUser({ email, password, displayName: name });
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: userRecord.uid, message: 'User created successfully' });
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Admin: Update user role
router.put('/:id/role', checkAdmin, validate(updateUserRoleSchema), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).update({ role: req.body.role });
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Admin: Delete user
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await auth.deleteUser(id);
    await db.collection('users').doc(id).delete();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
