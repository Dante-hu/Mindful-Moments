// src/app/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Add mood logs
export const addMoodLog = async (userId, moodData) => {
  await addDoc(collection(db, "mood_logs"), {
    userId,
    mood: moodData.mood,
    notes: moodData.notes,
    timestamp: new Date(),
  });
};

// Fetch mood logs
export const getMoodLogs = async (userId) => {
  const q = query(collection(db, "mood_logs"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      if (!data.mood || !data.timestamp) {
        console.warn("Invalid mood log:", doc.id);
        return null; // Skip invalid logs
      }
      return {
        mood: data.mood,
        notes: data.notes || "",
        timestamp: data.timestamp.toDate(),
      };
    })
    .filter((log) => log !== null); // Filter out invalid logs
};

export { db, auth };
