// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'mern-realestate-66114.firebaseapp.com',
    projectId: 'mern-realestate-66114',
    storageBucket: 'mern-realestate-66114.appspot.com',
    messagingSenderId: '1089399887368',
    appId: '1:1089399887368:web:42c34f47fa11c501cde3bd',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
