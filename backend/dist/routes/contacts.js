"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../lib/validators");
const router = (0, express_1.Router)();
// Public: Submit contact form
router.post('/', (0, validate_1.validate)(validators_1.contactSchema), async (req, res) => {
    try {
        const contact = {
            ...req.body,
            status: 'new',
            createdAt: new Date().toISOString(),
        };
        const docRef = await firebase_admin_1.db.collection('contacts').add(contact);
        res.status(201).json({ id: docRef.id, message: 'Contact submitted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit contact' });
    }
});
// Admin: List contacts
router.get('/', auth_1.checkAdmin, async (req, res) => {
    try {
        const snapshot = await firebase_admin_1.db.collection('contacts').orderBy('createdAt', 'desc').get();
        const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(contacts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});
// Admin: Update contact status
router.put('/:id/status', auth_1.checkAdmin, (0, validate_1.validate)(validators_1.contactStatusSchema), async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_admin_1.db.collection('contacts').doc(id).update({ status: req.body.status });
        res.json({ message: 'Contact status updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update contact status' });
    }
});
// Admin: Delete contact
router.delete('/:id', auth_1.checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_admin_1.db.collection('contacts').doc(id).delete();
        res.json({ message: 'Contact deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});
exports.default = router;
