"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const validate_1 = require("../middleware/validate");
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
exports.default = router;
