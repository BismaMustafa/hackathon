// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Only include if you are using Analytics
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADgixZv06PX9YjSy52g-oldxMWNsF8YNI",
  authDomain: "test-10e56.firebaseapp.com",
  projectId: "test-10e56",
  storageBucket: "test-10e56.appspot.com", // Keep this if needed, otherwise you can remove it
  messagingSenderId: "379424932927",
  appId: "1:379424932927:web:d68bf9a1737e7b433be48a",
  measurementId: "G-LLDZL78Y8P", // Only if you're using Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optionally initialize Analytics (only if you need it)
const analytics = getAnalytics(app); // Comment this line if you are not using Firebase Analytics

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export the initialized services
export { auth, db };
