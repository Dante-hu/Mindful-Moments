// api/auth.ts
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

// Register with Firebase
export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Returns Firebase user object
  } catch (error: any) {
    console.error("Registration error:", error.code, error.message);
     throw new Error(error.message || "Registration failed");
  }
};

// Login with Firebase
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Returns Firebase user object
  } catch (error: any) {
  console.error("Login error:", error.code, error.message);
  throw new Error(error.message || "Registration failed");
  }
};