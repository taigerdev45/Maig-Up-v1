"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("../config/firebase-admin");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Admin: Get dashboard stats
router.get('/stats', auth_1.checkAdmin, async (req, res) => {
    try {
        const [contactsSnap, registrationsSnap, testimonialsSnap] = await Promise.all([
            firebase_admin_1.db.collection('contacts').get(),
            firebase_admin_1.db.collection('registrations').get(),
            firebase_admin_1.db.collection('testimonials_submissions').get(),
        ]);
        const registrations = registrationsSnap.docs.map(doc => doc.data());
        const contacts = contactsSnap.docs.map(doc => doc.data());
        const registrationsByStatus = {
            'Validé': 0,
            'En attente': 0,
            'En cours': 0,
            'Incomplet': 0,
        };
        registrations.forEach(r => {
            const status = r.status;
            if (status in registrationsByStatus) {
                registrationsByStatus[status]++;
            }
        });
        const contactsByStatus = {
            new: 0,
            read: 0,
            treated: 0,
        };
        contacts.forEach(c => {
            const status = c.status;
            if (status in contactsByStatus) {
                contactsByStatus[status]++;
            }
        });
        res.json({
            totalContacts: contactsSnap.size,
            totalRegistrations: registrationsSnap.size,
            totalTestimonials: testimonialsSnap.size,
            registrationsByStatus,
            contactsByStatus,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});
// Admin: Get contacts & registrations evolution timeline
router.get('/evolution', auth_1.checkAdmin, async (req, res) => {
    try {
        const period = req.query.period || '30d';
        const now = new Date();
        let since;
        switch (period) {
            case '7d':
                since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '12m':
                since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        const sinceISO = since.toISOString();
        const [contactsSnap, registrationsSnap] = await Promise.all([
            firebase_admin_1.db.collection('contacts').where('createdAt', '>=', sinceISO).get(),
            firebase_admin_1.db.collection('registrations').where('createdAt', '>=', sinceISO).get(),
        ]);
        // Group by day (or month for 12m)
        const useMonth = period === '12m';
        const byKey = {};
        // Pre-fill all days/months in range
        const cursor = new Date(since);
        while (cursor <= now) {
            const key = useMonth
                ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
                : cursor.toISOString().slice(0, 10);
            byKey[key] = { contacts: 0, registrations: 0 };
            if (useMonth) {
                cursor.setMonth(cursor.getMonth() + 1);
            }
            else {
                cursor.setDate(cursor.getDate() + 1);
            }
        }
        contactsSnap.docs.forEach(doc => {
            const ts = doc.data().createdAt;
            const key = useMonth ? ts.slice(0, 7) : ts.slice(0, 10);
            if (byKey[key])
                byKey[key].contacts++;
        });
        registrationsSnap.docs.forEach(doc => {
            const ts = doc.data().createdAt;
            const key = useMonth ? ts.slice(0, 7) : ts.slice(0, 10);
            if (byKey[key])
                byKey[key].registrations++;
        });
        const timeline = Object.entries(byKey)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, counts]) => ({ date, ...counts }));
        res.json({ timeline, period });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch evolution data' });
    }
});
exports.default = router;
