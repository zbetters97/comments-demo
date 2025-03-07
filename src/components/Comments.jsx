import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import Authentication from "./Authentication";
import CommentList from "./CommentList";

export default function Comments() {

  const { globalUser, globalData, logout, commentData, addComment } = useAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const inputComment = useRef(null);

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

  async function submitComment(event) {

    event.preventDefault();

    if (!inputComment.current.value || !globalUser) {
      return;
    }

    const commentInfo = {
      content: inputComment.current.value,
      userId: globalUser.uid,
      replyingTo: "",
      replies: []
    }

    inputComment.current.value = "";
    await addComment(commentInfo);
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
          <form onSubmit={(event) => submitComment(event)}>
            <label htmlFor="comment">Post a comment</label>
            <input
              name="comment"
              type="text"
              ref={inputComment}
            />

            <button type="submit">
              Submit
            </button>
          </form>
          <button onClick={() => logout()} >
            Logout
          </button>
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