"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../lib/validators");
const router = (0, express_1.Router)();
// Public: Submit registration
router.post('/', (0, validate_1.validate)(validators_1.registrationSchema), async (req, res) => {
    try {
        const registration = {
            ...req.body,
            status: 'En attente',
            createdAt: new Date().toISOString(),
        };
        const docRef = await firebase_admin_1.db.collection('registrations').add(registration);
        res.status(201).json({ id: docRef.id, message: 'Registration submitted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit registration' });
    }
});
// Admin: List registrations
router.get('/', auth_1.checkAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const snapshot = await firebase_admin_1.db.collection('registrations').orderBy('createdAt', 'desc').get();
        const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const total = all.length;
        const paginated = all.slice((page - 1) * limit, page * limit);
        res.json({ data: paginated, total, page, limit });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});
// Admin: Update registration status
router.put('/:id/status', auth_1.checkAdmin, (0, validate_1.validate)(validators_1.registrationStatusSchema), async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_admin_1.db.collection('registrations').doc(id).update({ status: req.body.status });
        res.json({ message: 'Registration status updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update registration status' });
    }
});
// Admin: Delete registration
router.delete('/:id', auth_1.checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_admin_1.db.collection('registrations').doc(id).delete();
        res.json({ message: 'Registration deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete registration' });
    }
});
exports.default = router;
