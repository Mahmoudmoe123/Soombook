import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = (process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();
export default messaging;
