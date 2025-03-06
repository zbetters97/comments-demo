import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo-VBAtheMgJrsos_LL8NRwLb6EvTBfFQ",
  authDomain: "comments-demo-6ba8f.firebaseapp.com",
  projectId: "comments-demo-6ba8f",
  storageBucket: "comments-demo-6ba8f.firebasestorage.app",
  messagingSenderId: "397218819812",
  appId: "1:397218819812:web:87d338a6316b705f8106f1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
