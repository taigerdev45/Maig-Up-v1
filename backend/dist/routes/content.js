"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: Get all content components
router.get('/', async (req, res) => {
    try {
        const contentRef = firebase_admin_1.db.collection('content');
        const snapshot = await contentRef.get();
        const content = {};
        snapshot.forEach(doc => {
            content[doc.id] = doc.data();
        });
        res.json(content);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});
// Admin: Update content component
router.put('/:id', auth_1.checkAdmin, async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    try {
        await firebase_admin_1.db.collection('content').doc(id).set(newData, { merge: true });
        res.json({ message: `Content ${id} updated successfully` });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
    }
});
exports.default = router;
