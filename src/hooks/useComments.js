import { db } from "../config/firebase";
import { useAuth } from "./useAuth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export function useComments() {
  const { getUserById } = useAuth();

  async function getComments() {
    try {
      const commentsRef = collection(db, "comments");
      const commentsDoc = await getDocs(commentsRef);

      const comments = await Promise.all(
        commentsDoc.docs.map(async (doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            username: (await getUserById(doc.data().userId)).username,
          };
        }),
      );

      return comments;
    } catch (error) {
      console.error(error.message);
    }
  }

  async function addComment(commentInfo, replyId) {
    try {
      const comment = { ...commentInfo, createdAt: new Date() };
      const commentRef = collection(db, "comments");
      const commentDoc = await addDoc(commentRef, comment);

      if (replyId && replyId.length > 0) {
        const parentRef = doc(db, "comments", replyId);
        await updateDoc(parentRef, {
          replies: arrayUnion(commentDoc.id),
        });
      }

      return await getDoc(commentDoc);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function removeComment(commentId) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) return;

      // Delete from Firestore
      await deleteDoc(commentRef);

      // Get replied comments
      const { replies = [], replyingTo } = commentDoc.data();

      // For each reply, delete from Firestore
      if (replies.length > 0) {
        await Promise.all(replies.map(removeComment));
      }

      // Remove self from parent comment replies
      if (replyingTo && replyingTo !== "") {
        const parentRef = doc(db, "comments", replyingTo);
        const parentDoc = await getDoc(parentRef);

        if (!parentDoc.exists()) return;

        await updateDoc(parentRef, {
          replies: arrayRemove(commentId),
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function likeComment(commentId, uid) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {
        const likes = commentDoc.data().likes;
        const dislikes = commentDoc.data().dislikes;

        // User already liked comment, remove like
        if (likes.includes(uid)) {
          await updateDoc(commentRef, {
            likes: arrayRemove(uid),
          });
        } else {
          // User disliked comment, remove dislike
          if (dislikes.includes(uid)) {
            await updateDoc(commentRef, {
              dislikes: arrayRemove(uid),
            });
          }

          // Add user ID to likes array
          await updateDoc(commentRef, {
            likes: arrayUnion(uid),
          });
        }

        return (await getDoc(commentRef)).data();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function dislikeComment(commentId, uid) {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {
        const dislikes = commentDoc.data().dislikes;
        const likes = commentDoc.data().likes;

        // User already disliked comment, remove dislike
        if (dislikes.includes(uid)) {
          await updateDoc(commentRef, {
            dislikes: arrayRemove(uid),
          });
        } else {
          // User liked comment, remove like
          if (likes.includes(uid)) {
            await updateDoc(commentRef, {
              likes: arrayRemove(uid),
            });
          }

          // Add user ID to dislikes array
          await updateDoc(commentRef, {
            dislikes: arrayUnion(uid),
          });
        }

        return (await getDoc(commentRef)).data();
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
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);

      const replies = [];
      querySnapshot.forEach((reply) => {
        replies.push({
          id: reply.id,
          ...reply.data(),
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    getComments,
    addComment,
    removeComment,
    likeComment,
    dislikeComment,
    getReplies,
  };
}
