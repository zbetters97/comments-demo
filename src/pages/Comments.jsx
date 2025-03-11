import { useCallback, useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Authentication from "../components/Authentication";
import CommentList from "../components/Comment/CommentList";
import CommentInput from "../components/Comment/CommentInput";
import "../styles/pages/css/comments.css";
import Modal from "../components/Modal"

export default function Comments() {

  const { globalUser, globalData, logout, commentData, addComment } = useAuthContext();

  const [openModal, setOpenModal] = useState(false);

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
    <div className="w-screen p-4">
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Authentication onClose={() => setOpenModal(false)} />
      </Modal>

      <div className="w-1/1 p-4 m-auto flex justify-between align-center">
        {globalData && globalUser ? (
          <>
            <h1 className="text-lg">
              Hello, {globalData.firstName}
            </h1>
            <button
              className="bg-gray-300 rounded-sm py-1 px-3"
              onClick={() => logout()}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="bg-gray-300 rounded-sm py-1 px-3"
            data-modal-target="default-modal" data-modal-toggle="default-modal"
            onClick={() => setOpenModal(true)}
          >
            Login
          </button>)
        }
      </div>

      <h2 className="text-xl font-bold">
        {comments.length} Comments
      </h2>

      <div className="p-4 w-10/12">
        {globalUser && <CommentInput postComment={postComment} />}
        <CommentList comments={comments} />
      </div>
    </div>
  );
}