// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvB42Wlmn_OTfaiq39byyxgvKdtAi_o34",
  authDomain: "moviemaster-308b2.firebaseapp.com",
  projectId: "moviemaster-308b2",
  storageBucket: "moviemaster-308b2.appspot.com",
  messagingSenderId: "1037829874098",
  appId: "1:1037829874098:web:3c6e444fdacae78a9304ab",
  measurementId: "G-HCDCMS2B0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);