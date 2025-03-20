import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { useAuth } from "../hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
  } = useAuth();

  useEffect(() => {
    // Update global user on auth change
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setGlobalUser(user);

      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          setGlobalData(userDoc.data());
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    return unsubscribe;
  }, []);

  const dbMethods = {
    globalUser,
    globalData,
    isModalOpen,
    setIsModalOpen,
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
  };

  return (
    // Provide useContext with DB values and methods
    <AuthContext.Provider value={dbMethods}>{children}</AuthContext.Provider>
  );
}
