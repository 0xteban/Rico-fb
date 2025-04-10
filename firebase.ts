
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBcumyI6bEKwTBKmL-guiEil3UewQZI5j0',
  authDomain: 'rico-a68a7.firebaseapp.com',
  projectId: 'rico-a68a7',
  storageBucket: 'rico-a68a7.firebasestorage.app',
  messagingSenderId: '22136231447',
  appId: '1:22136231447:web:15b5fa05353d839eb6ae52',
  measurementId: 'G-GCGHQ2VT01'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };