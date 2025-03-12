import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getTimeSince } from "../utils/date";

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
  const [sortValue, setSortValue] = useState("createdAt");

  async function signup(email, password, firstName, lastName, phone, username) {

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
        username: username
      }

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userData);

      return true;
    }
    catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log("The email address is already in use!");
      } else {
        console.log(error.message);
      }

      return false;
    }
  }

  async function usernameAvailable(username) {

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty;
    }
    catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async function login(email, password) {

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
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
        console.log(error.message);
      }
      return false;
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

    try {
      const docRef = doc(db, "users", userId);
      const userDoc = await getDoc(docRef);

      let userData = {};

      if (userDoc.exists()) {
        userData = userDoc.data();
      }

      return userData;
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async function addComment(commentInfo, replyId) {

    try {
      const comment = {
        ...commentInfo,
        createdAt: new Date(),
        likes: [],
        numLikes: 0,
        dislikes: [],
        numDislikes: 0,
      }

      const commentRef = collection(db, "comments");
      const commentDoc = await addDoc(commentRef, comment);

      // Comment is a reply
      if (replyId && replyId !== "") {

        const commentId = commentDoc.id;

        // Get replied to comment
        const parentRef = doc(db, "comments", replyId);
        const parentDoc = await getDoc(parentRef);

        // Add to parent comment replies array
        if (parentDoc.exists()) {
          await updateDoc(parentRef, {
            replies: arrayUnion(commentId)
          });
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async function removeComment(commentId) {

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {

        // Delete from DB
        await deleteDoc(commentRef);

        // Get replied comments
        const children = commentDoc.data().replies;

        if (children && children.length > 0) {

          // For each reply, delete from DB
          children.forEach(async (childId) => {
            await removeComment(childId);
          });
        }

        // Get replied to comment
        const parentId = commentDoc.data().replyingTo;

        if (parentId && parentId !== "") {

          const parentRef = doc(db, "comments", parentId);
          const parentDoc = await getDoc(parentRef);

          // Remove self from parent comment replies array
          if (parentDoc.exists()) {
            await updateDoc(parentRef, {
              replies: arrayRemove(commentId)
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function likeComment(commentId) {

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists() && globalUser) {

        const uid = globalUser.uid;

        const likes = commentDoc.data().likes;
        const dislikes = commentDoc.data().dislikes;

        // User already liked comment, remove like
        if (likes.includes(uid)) {
          await updateDoc(commentRef, {
            likes: arrayRemove(uid),
            numLikes: increment(-1)
          });
        }
        else {

          // User disliked comment, remove dislike
          if (dislikes.includes(uid)) {
            await updateDoc(commentRef, {
              dislikes: arrayRemove(uid),
              numDislikes: increment(-1)
            })
          }

          // Add user ID to likes array
          await updateDoc(commentRef, {
            likes: arrayUnion(uid),
            numLikes: increment(1)
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

      if (commentDoc.exists() && globalUser) {

        const uid = globalUser.uid;

        const dislikes = commentDoc.data().dislikes;
        const likes = commentDoc.data().likes;

        // User already disliked comment, remove dislike
        if (dislikes.includes(uid)) {
          await updateDoc(commentRef, {
            dislikes: arrayRemove(uid),
            numDislikes: increment(-1),
          });
        }
        else {

          // User liked comment, remove like
          if (likes.includes(uid)) {
            await updateDoc(commentRef, {
              likes: arrayRemove(uid),
              numLikes: increment(-1)
            })
          }

          // Add user ID to dislikes array
          await updateDoc(commentRef, {
            dislikes: arrayUnion(uid),
            numDislikes: increment(1)
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

    // Update global user on auth change
    return () => onAuthStateChanged(auth, async (user) => {

      setGlobalUser(user);

      if (!user) {
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);

        let userData = {};
        if (userDoc.exists()) {
          userData = userDoc.data();
        }

        setGlobalData(userData);
      }
      catch (error) {
        console.log(error.message);
      }
    });
  }, []);

  useEffect(() => {

    const unsubscribe = () => onSnapshot(
      query(collection(db, "comments"), orderBy(sortValue, "desc")),
      async (comments) => {

        const commentInfo = await Promise.all(comments.docs.map(async (comment) => (
          {
            id: comment.id,
            ...comment.data(),
            date: getTimeSince(comment.data().createdAt.toDate()),
            username: await getUserById(comment.data().userId).username
          }
        )));

        setCommentData(commentInfo);
      }
    );

    return unsubscribe();
  }, [sortValue]);


  const dbMethods = {
    globalUser, globalData, signup, usernameAvailable, login, logout, resetPassword,
    commentData, sortValue, setSortValue, getReplies, likeComment, dislikeComment, addComment, removeComment,
  };

  return (
    // Provide useContext with DB values and methods
    <AuthContext.Provider value={dbMethods}>
      {children}
    </AuthContext.Provider>
  );
}