import { useCallback, useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Authentication from "../components/Authentication";
import CommentList from "../components/Comment/CommentList";
import CommentInput from "../components/Comment/CommentInput";
import "../styles/pages/css/Comments.css";
import Modal from "../components/Modal"

export default function Comments() {

  const { globalUser, globalData, logout, commentData, addComment } = useAuthContext();

  const [openModal, setOpenModal] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortValue, setSortValue] = useState("createdAt");

  // Freezes comments variable until commentData or sortValue changes
  const comments = useMemo(
    () => {
      if (!commentData || commentData.length === 0) {
        return [];
      }

      const comments = commentData.map((comment) => ({
        id: comment.id,
        ...comment
      }));

      const sortedComments = comments.sort((a, b) => {
        return b[sortValue] - a[sortValue] || b.createdDate - a.createdDate;
      });

      return sortedComments;
    },
    [commentData, sortValue]
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

      <div className="flex flex-col gap-4 ml-2 mb-2">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>

        <div className="relative w-fit">
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => { setShowSort(!showSort); }}
          >
            <i className="fa-solid fa-sort"></i>
            <p>Sort by</p>
          </button>


          <div className={`absolute left-0 right-0 w-fit bg-white shadow-lg rounded-lg overflow-hidden
          transition-all duration-300 ease-in-out
            ${showSort ? "max-h-screen p-2" : "max-h-0"}
            `}>
            <button
              className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
              onClick={() => { setSortValue("createdAt"); setShowSort(false); }}
            >
              Newest
            </button>
            <button
              className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
              onClick={() => { setSortValue("numLikes"); setShowSort(false); }}
            >
              Best
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 w-10/12">
        {globalUser && <CommentInput postComment={postComment} />}
        <CommentList comments={comments} />
      </div>
    </div >
  );
}