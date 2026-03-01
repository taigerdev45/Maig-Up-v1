import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
  console.error('Missing Firebase Admin environment variables. Check backend/.env');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();
const auth = admin.auth();

async function createAdmin(email: string, pass: string): Promise<void> {
  try {
    let uid: string = '';
    try {
      // 1. Try to create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password: pass,
        emailVerified: true,
      });
      uid = userRecord.uid;
      console.log(`Successfully created new auth user: ${uid}`);
    } catch (err: unknown) {
      if (err instanceof Error && (err as { code?: string }).code === 'auth/email-already-exists') {
        const userRecord = await auth.getUserByEmail(email);
        uid = userRecord.uid;
        console.log(`User already exists in Auth, updating Firestore role for UID: ${uid}`);
      } else {
        throw err;
      }
    }

    // 2. Set role in Firestore
    await db.collection('users').doc(uid).set({
      email,
      role: 'ADMIN',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`Successfully assigned ADMIN role to: ${email} (UID: ${uid})`);
    
    // 3. Initialize default content
    const contentRef = db.collection('content');
    const servicesDoc = await contentRef.doc('services').get();
    if (!servicesDoc.exists) {
        await contentRef.doc('services').set({
            items: [
                { icon: 'FileText', title: 'Dossier Campus France', description: 'Création de compte et constitution complète de votre dossier Campus France.' },
                { icon: 'GraduationCap', title: 'Choix des universités', description: 'Sélection stratégique des formations adaptées à votre profil.' }
            ]
        });
        console.log('Initialized default services content.');
    }

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit();
  }
}

// Usage: node dist/scripts/init-admin.js <email> <password>
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: npx ts-node src/scripts/init-admin.ts <email> <password>');
  process.exit(1);
}

createAdmin(args[0], args[1]);
