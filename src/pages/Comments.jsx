import { useCallback, useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";
import Authentication from "../components/Authentication";
import CommentList from "../components/Comment/CommentList";
import CommentInput from "../components/Comment/CommentInput";

export default function Comments() {

  const { globalUser, globalData, logout, commentData, addComment } = useAuthContext();

  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  // Freezes comments variable until commentData changes
  const comments = useMemo(
    () => {
      if (!commentData || commentData.length === 0) {
        return [];
      }

      return commentData.map((comment) => ({
        id: comment.id,
        ...comment
      }));
    },

    [commentData]
  );

  // Memoizes function to prevent re-render of CommentInput (when globalUser loads)
  const postComment = useCallback(async (event, content) => {

    event.preventDefault();

    if (!content || !globalUser) {
      return;
    }

    const replyInfo = {
      content: content,
      userId: globalUser.uid,
      replyingTo: "",
      replies: []
    }

    await addComment(replyInfo);
  }, [globalUser]);

  return (
    <div>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>)
      }

      {globalData && globalUser && (
        <h1>Hello, {globalData.firstName}</h1>)
      }

      <h2>Comments</h2>

      {globalUser ? (
        <div>
          <button onClick={() => logout()} >
            Logout
          </button>

          <div>
            <p>Leave a comment</p>
            <CommentInput postComment={postComment} />
          </div>
        </div>)
        : (
          <div>
            <button onClick={() => setShowModal(true)}>
              Login
            </button>
            <div>
              <p>Login to leave a comment</p>
            </div>
          </div>)
      }

      <CommentList comments={comments} />
    </div>
  );
}