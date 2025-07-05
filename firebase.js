// firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFXMBMBzvcRb-iGtXGF3crciOsel-P5Qs",
  authDomain: "imameapp-6162e.firebaseapp.com",
  projectId: "imameapp-6162e",
  storageBucket: "imameapp-6162e.appspot.com",
  messagingSenderId: "974579367446",
  appId: "1:974579367446:web:f6bdb864920a9657a27f37"
};

// Uygulamayı başlat
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Storage servisini başlat
const storage = getStorage(app);

export { app, storage };
