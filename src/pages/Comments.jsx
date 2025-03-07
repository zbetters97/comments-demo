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

  function handleCloseModal() {
    setShowModal(false);
  }

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

    if (!commentData) {
      setComments([]);
      return;
    }

    const commentsArray = Object.keys(commentData).map((key) => (
      {
        id: key,
        ...commentData[key],
      }
    ));

    setComments(commentsArray);
  }, [commentData]);

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
            <CommentInput postComment={submitReply} />
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