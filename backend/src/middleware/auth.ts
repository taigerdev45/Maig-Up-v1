import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase-admin';

import * as admin from 'firebase-admin';

export type AuthRequest = Request & {
  user?: admin.auth.DecodedIdToken;
};

export const checkAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Check if user has admin role in Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
