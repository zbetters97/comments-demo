import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import Authentication from "./Authentication";
import CommentList from "./CommentList";
import { getTimeSince } from "../utils/date";

export default function Comments() {

  const { globalUser, globalData, logout, getUserById, commentData, addComment } = useAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {

    const getComments = async () => {

      if (!commentData) {
        setComments([]);
        return;
      }

      const commentsArray = await Promise.all(Object.keys(commentData)
        .map(async (key) => (
          {
            id: key,
            ...commentData[key],
            numLikes: commentData[key].likes.length,
            numDislikes: commentData[key].dislikes.length,
            date: getTimeSince(commentData[key].createdAt.toDate()),
            ...await getUserById(commentData[key].userId)
          }
        )));

      setComments(commentsArray);
    }

    getComments();
  }, [commentData]);

  function handleCloseModal() {
    setShowModal(false);
  }

  async function submitComment(event) {

    event.preventDefault();

    if (!comment || !globalUser) {
      return;
    }

    const commentInfo = {
      content: comment,
      userId: globalUser.uid,
      reply: false,
      replies: []
    }

    setComment("");

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
              value={comment}
              onChange={(event) => setComment(event.target.value)}
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