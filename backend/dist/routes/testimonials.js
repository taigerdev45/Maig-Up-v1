"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const validators_1 = require("../lib/validators");
const router = (0, express_1.Router)();
// Public: Submit a testimonial
router.post('/', (0, validate_1.validate)(validators_1.testimonialSubmitSchema), async (req, res) => {
    try {
        const testimonial = {
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        const docRef = await firebase_admin_1.db.collection('testimonials_submissions').add(testimonial);
        res.status(201).json({ id: docRef.id, message: 'Testimonial submitted for review' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit testimonial' });
    }
});
// Admin: Get all pending testimonials
router.get('/', auth_1.checkAdmin, async (req, res) => {
    try {
        const snapshot = await firebase_admin_1.db.collection('testimonials_submissions').orderBy('createdAt', 'desc').get();
        const testimonials = [];
        snapshot.forEach(doc => {
            testimonials.push({ id: doc.id, ...doc.data() });
        });
        res.json(testimonials);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});
// Admin: Update testimonial status
router.put('/:id/status', auth_1.checkAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Publié', 'Rejeté', 'En attente'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    try {
        const docRef = firebase_admin_1.db.collection('testimonials_submissions').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        await docRef.update({ status });
        // If published, we also add it to the content/testimonials array
        if (status === 'Publié') {
            const testimonialData = doc.data();
            const contentRef = firebase_admin_1.db.collection('content').doc('testimonials');
            const contentDoc = await contentRef.get();
            let items = [];
            if (contentDoc.exists) {
                items = contentDoc.data()?.items || [];
            }
            // Avoid simple duplicates by name and quote
            const isDuplicate = items.some(t => t.name === testimonialData?.name && t.quote === testimonialData?.quote);
            if (!isDuplicate) {
                items.push({
                    name: testimonialData?.name,
                    quote: testimonialData?.quote,
                    country: testimonialData?.country,
                    university: testimonialData?.university,
                    program: testimonialData?.program,
                    status: 'Publié',
                    date: new Date().toISOString().split('T')[0]
                });
                await contentRef.set({ items }, { merge: true });
            }
        }
        res.json({ message: 'Testimonial status updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update testimonial status' });
    }
});
// Admin: Delete a testimonial submission
router.delete('/:id', auth_1.checkAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const docRef = firebase_admin_1.db.collection('testimonials_submissions').doc(id);
        await docRef.delete();
        res.json({ message: 'Testimonial submission deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});
exports.default = router;
