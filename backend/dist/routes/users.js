"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../lib/validators");
const router = (0, express_1.Router)();
// Admin: List users
router.get('/', auth_1.checkAdmin, async (req, res) => {
    try {
        const snapshot = await firebase_admin_1.db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Admin: Create user
router.post('/', auth_1.checkAdmin, (0, validate_1.validate)(validators_1.createUserSchema), async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const userRecord = await firebase_admin_1.auth.createUser({ email, password, displayName: name });
        await firebase_admin_1.db.collection('users').doc(userRecord.uid).set({
            email,
            name,
            role,
            createdAt: new Date().toISOString(),
        });
        res.status(201).json({ id: userRecord.uid, message: 'User created successfully' });
    }
    catch (error) {
        if (error.code === 'auth/email-already-exists') {
            res.status(409).json({ error: 'Email already exists' });
            return;
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});
// Admin: Update user role
router.put('/:id/role', auth_1.checkAdmin, (0, validate_1.validate)(validators_1.updateUserRoleSchema), async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_admin_1.db.collection('users').doc(id).update({ role: req.body.role });
        res.json({ message: 'User role updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});
// Admin: Delete user
router.delete('/:id', auth_1.checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_admin_1.auth.deleteUser(id);
        await firebase_admin_1.db.collection('users').doc(id).delete();
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.default = router;
