import { useCallback, useEffect, useState } from "react";
import Modal from "../components/Modal";
import Authentication from "../components/Authentication";
import Sorter from "../components/Comment/Sorter";
import CommentList from "../components/Comment/CommentList";
import CommentInput from "../components/Comment/CommentInput";
import { useAuthContext } from "../context/AuthContext";

export default function CommentsPage() {
  const { globalUser, globalData, logout, getComments, addComment } =
    useAuthContext();

  const [openModal, setOpenModal] = useState(false);
  const [comments, setComments] = useState([]);

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

  // Memoizes function to prevent re-render of CommentInput (when globalUser loads)
  const postComment = useCallback(
    async (event, content) => {
      event.preventDefault();

      if (!content || !globalUser) {
        return;
      }

      const comment = {
        content: content,
        userId: globalUser.uid,
        likes: [],
        dislikes: [],
        replyingTo: "",
        replies: [],
      };

      const newComment = await addComment(comment);

      setComments((prevData) => [
        {
          id: newComment.id,
          ...newComment.data(),
          username: globalData.username,
        },
        ...prevData,
      ]);
    },
    [globalUser, globalData],
  );

  return (
    <div className="w-screen p-4">
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Authentication onClose={() => setOpenModal(false)} />
      </Modal>

      <div className="align-center m-auto flex w-1/1 justify-between p-4">
        {globalData && globalUser ? (
          <>
            <h1 className="text-lg">Hello, {globalData.firstName}</h1>
            <button
              className="rounded-sm bg-gray-300 px-3 py-1"
              onClick={() => logout()}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="rounded-sm bg-gray-300 px-3 py-1"
            data-modal-target="default-modal"
            data-modal-toggle="default-modal"
            onClick={() => setOpenModal(true)}
          >
            Login
          </button>
        )}
      </div>

      <div className="mb-2 ml-2 flex flex-col gap-4">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>

        {comments.length > 0 && (
          <Sorter comments={comments} setComments={setComments} />
        )}
      </div>

      <div className="w-10/12 p-4">
        {globalUser && <CommentInput postComment={postComment} />}
        <CommentList comments={comments} setComments={setComments} />
      </div>

      {comments.length === 0 && (
        <p className="m-auto text-center text-2xl">No comments yet!</p>
      )}
    </div>
  );
}
