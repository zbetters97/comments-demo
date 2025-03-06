import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuthContext() {
  const db = useContext(AuthContext);

  if (db === undefined) {
    throw new Error("Error! Database could not be retrieved.");
  }

  return db;
}

export function AuthProvidor(props) {

  const { children } = props;

  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  async function signup(email, password, firstName, lastName, phone) {

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, email, password
      );

      const user = userCredential.user;

      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      }

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userData);
    }
    catch (error) {

      if (error.code === "auth/email-already-in-use") {
        console.log("The email address is already in use!");
      } else {
        console.log(error.code);
      }
    }
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    }
    catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        console.log("The email or password is incorrect!");
      }
      else {
        console.log(error.code);
      }
    }
  }

  function logout() {
    setGlobalUser(null);
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserById(userId) {

    const docRef = doc(db, "users", userId);
    const userDoc = await getDoc(docRef);

    let userData = {};

    if (userDoc.exists()) {
      userData = userDoc.data();
    }

    return userData;
  }

  async function addComment(commentInfo, replyId) {

    try {

      const comment = {
        ...commentInfo,
        createdAt: new Date(),
        likes: [],
        dislikes: [],
      }

      let commentRef = collection(db, "comments");
      let commentDoc = await addDoc(commentRef, comment);
      const commentId = commentDoc.id;

      // COMMENT IS A REPLY
      if (replyId && commentInfo.reply) {

        commentRef = doc(db, "comments", replyId);
        commentDoc = await getDoc(commentRef);

        if (commentDoc.exists()) {
          await updateDoc(commentRef, {
            replies: arrayUnion(commentId)
          });
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function likeComment(commentId) {

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {

        const uid = globalUser.uid;

        const likes = commentDoc.data().likes;
        const dislikes = commentDoc.data().dislikes;

        if (likes.includes(uid)) {
          await updateDoc(commentRef, {
            likes: arrayRemove(uid)
          });
        }
        else {
          if (dislikes.includes(uid)) {
            await updateDoc(commentRef, {
              dislikes: arrayRemove(uid)
            })
          }

          await updateDoc(commentRef, {
            likes: arrayUnion(uid)
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function dislikeComment(commentId) {

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {

        const uid = globalUser.uid;

        const dislikes = commentDoc.data().dislikes;
        const likes = commentDoc.data().likes;

        if (dislikes.includes(uid)) {
          await updateDoc(commentRef, {
            dislikes: arrayRemove(uid)
          });
        }
        else {
          if (likes.includes(uid)) {
            await updateDoc(commentRef, {
              likes: arrayRemove(uid)
            })
          }

          await updateDoc(commentRef, {
            dislikes: arrayUnion(uid)
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getReplies(commentId) {

    try {
      const commentsRef = collection(db, "comments");

      const q = query(
        commentsRef,
        where("replyTo", "==", commentId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const replies = [];
      querySnapshot.forEach((reply) => {
        replies.push({
          id: reply.id,
          ...reply.data()
        });
      });
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      setGlobalUser(user)

      if (!user) {
        return
      }

      try {
        const docRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(docRef)

        let userData = {}
        if (userDoc.exists()) {
          userData = userDoc.data();
        }

        setGlobalData(userData)
      } catch (error) {
        console.log(error.message)
      }
    })

    return unsubscribe;
  }, []);

  useEffect(() => {

    return () => onSnapshot(collection(db, "comments"), (comments) => {

      const commentInfo = comments.docs.map((comment) => ({
        id: comment.id,
        ...comment.data(),
      }));

      setCommentData(commentInfo);
    });
  }, []);

  const dbMethods = {
    globalUser, globalData, commentData, signup, login, logout, resetPassword, getUserById,
    addComment, likeComment, dislikeComment, getReplies
  };

  return (
    // PROVIDE useContext WITH DATABASE METHODS
    <AuthContext.Provider value={dbMethods}>
      {children}
    </AuthContext.Provider>
  );
}