import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
const env = import.meta.env;
export const isDemo = env.VITE_DATA_MODE !== "firebase";
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};
const configured = config.apiKey && config.projectId && config.appId;
const app = !isDemo && configured ? initializeApp(config) : null;
export const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
let login;
export async function buyerSession() {
  if (!auth)
    throw new Error("Falta configurar Firebase. Revisa el archivo .env.local.");
  if (auth.currentUser) return auth.currentUser.uid;
  login ??= signInAnonymously(auth).catch((error) => {
    login = null;
    throw error;
  });
  return (await login).user.uid;
}
