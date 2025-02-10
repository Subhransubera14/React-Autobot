import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // ✅ Import Firebase Authentication
import {getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0SFlkbRYv0yuCVpOcHil5pSl4ZXM4SpY",
  authDomain: "predator-6ddd3.firebaseapp.com",
  projectId: "predator-6ddd3",
  storageBucket: "predator-6ddd3.appspot.com",  // ✅ Fixed storage bucket format
  messagingSenderId: "144289743677",
  appId: "1:144289743677:web:faf4318f7c24bf1c12bb54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // ✅ Export Firebase Authentication
export const db = getFirestore(app);