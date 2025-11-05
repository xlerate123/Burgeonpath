import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwCqYEbgy5aJBL-4EarFcl0kvA9JoZfmI",
  authDomain: "climbloop-8b14d.firebaseapp.com",
  projectId: "climbloop-8b14d",
  storageBucket: "climbloop-8b14d.firebasestorage.app",
  messagingSenderId: "823231437900",
  appId: "1:823231437900:web:28929dd2dcd4d257ee28e9",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

