import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";

export const authMode = (import.meta.env.VITE_AUTH_MODE ?? "dev") as "dev" | "firebase";

const app = authMode === "firebase" ? initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}) : null;
export const fbAuth = app ? getAuth(app) : null;

export const googleSignIn = () => signInWithPopup(fbAuth!, new GoogleAuthProvider());
export const fbSignOut = () => (fbAuth ? signOut(fbAuth) : Promise.resolve());
export const watchAuth = (cb: (u: User | null) => void) => (fbAuth ? onAuthStateChanged(fbAuth, cb) : () => {});
export const currentIdToken = async () => (fbAuth?.currentUser ? fbAuth.currentUser.getIdToken() : null);
