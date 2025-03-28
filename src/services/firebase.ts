import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz6YDf0OLv0cXihel5OIA37EKP_W3-unM",
  authDomain: "workflow-79f66.firebaseapp.com",
  projectId: "workflow-79f66",
  storageBucket: "workflow-79f66.firebasestorage.app",
  messagingSenderId: "361114815419",
  appId: "1:361114815419:web:d467f0d10deb4725fdd29e",
  measurementId: "G-V3ZJ5BLVWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 