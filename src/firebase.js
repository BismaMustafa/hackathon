// Import the necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore for database functionalities
import { getAuth } from "firebase/auth"; // Authentication service
// Uncomment the following lines if you're using Analytics
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADgixZv06PX9YjSy52g-oldxMWNsF8YNI",
  authDomain: "test-10e56.firebaseapp.com",
  projectId: "test-10e56",
  storageBucket: "test-10e56.appspot.com", // Keep this if you're using storage; otherwise, you can remove it
  messagingSenderId: "379424932927",
  appId: "1:379424932927:web:d68bf9a1737e7b433be48a",
  measurementId: "G-LLDZL78Y8P", // Only if you plan to use Firebase Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optionally initialize Firebase Analytics if you are using it
// const analytics = getAnalytics(app);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Export the initialized services for use in your application
export { auth, db };
