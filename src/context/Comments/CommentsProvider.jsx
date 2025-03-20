import { useEffect, useState } from "react";
import { useComments } from "../../hooks/useComments";
import CommentsContext from "./CommentsContext";

export function CommentsProvider({ children }) {
  const [comments, setComments] = useState([]);

  const {
    getComments,
    addComment,
    removeComment,
    likeComment,
    dislikeComment,
    getReplies,
  } = useComments();

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
    <CommentsContext.Provider value={dbMethods}>
      {children}
    </CommentsContext.Provider>
  );
}
