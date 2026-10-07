import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyAN_XgC-O03I_EWw8J4Awh8yRg2V_jLFP8",
  authDomain: "feedbackai-4424d.firebaseapp.com",
  databaseURL:
    "https://feedbackai-4424d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "feedbackai-4424d",
  storageBucket: "feedbackai-4424d.firebasestorage.app",
  messagingSenderId: "250706396405",
  appId: "1:250706396405:web:7a005578a2e684a817b1bc",
  measurementId: "G-3MZL9C0SGG",
};

export const app: FirebaseApp = getApps().length
  ? getApps()[0]!
  : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);

/** E-mails autorisés à accéder au dashboard admin (configurés par l'équipe). */
export const ADMIN_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@ooredoo.dz"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email: string | null | undefined): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());
