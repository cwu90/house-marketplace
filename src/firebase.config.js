import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAJR7uHF6cCtYjCaQ4Xk9qOwvGOgrPj7m8',
  authDomain: 'house-marketplace-app-e2999.firebaseapp.com',
  projectId: 'house-marketplace-app-e2999',
  storageBucket: 'house-marketplace-app-e2999.appspot.com',
  messagingSenderId: '416186972112',
  appId: '1:416186972112:web:071b9c4b482a543690ebd5',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
