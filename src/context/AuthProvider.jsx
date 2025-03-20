import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { useAuth } from "../hooks/useAuth";
import { useComments } from "../hooks/useComments";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [comments, setComments] = useState([]);

  const {
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
  } = useAuth();

  const {
    getComments,
    addComment,
    removeComment,
    likeComment,
    dislikeComment,
    getReplies,
  } = useComments();

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

  // Fetch Firebase comment data and set to useState (first load)
  useEffect(() => {
    const fetchData = async () => {
      const comments = await getComments();

      if (!comments || comments.length === 0) {
        return;
      }

      setComments([...comments.sort((a, b) => b.createdAt - a.createdAt)]);
    };

    fetchData();
  }, []);

  function updateCommentState(comment, updatedComment) {
    Object.assign(comment, updatedComment);

    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }

  const dbMethods = {
    globalUser,
    globalData,
    signup,
    usernameAvailable,
    login,
    logout,
    resetPassword,
    getUserById,
    comments,
    setComments,
    updateCommentState,
    getComments,
    addComment,
    removeComment,
    likeComment,
    dislikeComment,
    getReplies,
  };

  return (
    // Provide useContext with DB values and methods
    <AuthContext.Provider value={dbMethods}>{children}</AuthContext.Provider>
  );
}
