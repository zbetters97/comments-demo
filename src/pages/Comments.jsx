import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";
import Authentication from "../components/Authentication";
import CommentList from "../components/Comment/CommentList";
import CommentInput from "../components/Comment/CommentInput";

export default function Comments() {

  const { globalUser, globalData, logout, commentData, addComment } = useAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);

  async function submitReply(event, content) {

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
  }

  useEffect(() => {

    function getComments() {

      if (!commentData) {
        setComments([]);
        return;
      }

      const commentsArray = Object.keys(commentData).map((key) => ({
        id: key,
        ...commentData[key],
      }));

      setComments(commentsArray);
    }

    getComments();
  }, [commentData]);

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <div>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}

      {globalData && globalUser && (
        <h1>Hello, {globalData.firstName} </h1>
      )}

      <h2>Comments</h2>

      {globalUser ? (
        <div>
          <button onClick={() => logout()} >
            Logout
          </button>

          <div>
            <p>Leave a comment</p>
            <CommentInput postComment={submitReply} />
          </div>
        </div>
      ) : (
        <div>
          <p>Login to leave a comment</p>
          <button onClick={() => setShowModal(true)}>
            Login
          </button>
        </div>
      )}

      <CommentList comments={comments} />
    </div >
  );
}