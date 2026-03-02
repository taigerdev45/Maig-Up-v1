"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../lib/validators");
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
// Admin: Update content component (with optional validation)
router.put('/:id', auth_1.checkAdmin, (req, res, next) => {
    const { id } = req.params;
    const schema = validators_1.contentSchemaMap[id];
    if (schema) {
        return (0, validate_1.validate)(schema)(req, res, next);
    }
    next();
}, async (req, res) => {
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
