// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "media-wave-57502.firebaseapp.com",
  projectId: "media-wave-57502",
  storageBucket: "media-wave-57502.firebasestorage.app",
  messagingSenderId: "238897718778",
  appId: "1:238897718778:web:ba0f17d773dbf706acb043",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
