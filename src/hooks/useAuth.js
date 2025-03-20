import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

export function useAuth() {
  async function signup(email, password, firstName, lastName, phone, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const userData = {
        email,
        firstName,
        lastName,
        phone,
        username,
      };

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userData);

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async function usernameAvailable(username) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserById(userId) {
    try {
      const docRef = doc(db, "users", userId);
      const userDoc = await getDoc(docRef);

      let userData = {};
      if (userDoc.exists()) {
        userData = userDoc.data();
      }

      return userData;
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
  };
}
