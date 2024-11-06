// frontend/src/firebaseConfig.jsx

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore



const firebaseConfig = {
  apiKey: "AIzaSyCrQkUlz-EnJV5Lb1WCO-hEf4ZKAMe9F9o",
  authDomain: "bag-store-a932b.firebaseapp.com",
  projectId: "bag-store-a932b",
  storageBucket: "bag-store-a932b.firebasestorage.app",
  messagingSenderId: "34386914819",
  appId: "1:34386914819:web:7503d04059550ea977a836"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth};