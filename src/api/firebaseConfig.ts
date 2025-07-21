// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVUmb3y_tc-18LBKZzsZQtORH7IqIyXg4",
  authDomain: "love-memory-367f2.firebaseapp.com",
  projectId: "love-memory-367f2",
  storageBucket: "love-memory-367f2.firebasestorage.app",
  messagingSenderId: "300021745881",
  appId: "1:300021745881:web:f28e2e827d35e1750356c8",
  measurementId: "G-DHF8DS9ZB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);