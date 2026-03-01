"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const firebase_admin_1 = require("../config/firebase-admin");
const checkAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(idToken);
        // Check if user has admin role in Firestore
        const userDoc = await firebase_admin_1.db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();
        if (!userData || userData.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.checkAdmin = checkAdmin;
