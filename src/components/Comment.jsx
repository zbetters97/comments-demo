import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Comment(props) {

  const { comment, comments } = props;
  const { globalUser, likeComment, dislikeComment, addComment, removeComment } = useAuthContext();

  const [replyingTo, setReplyingTo] = useState([]);
  const [replies, setReplies] = useState({});

  function resetReplyState(commentId) {

    // RESET useState COMMENT REPLY
    const { [commentId]: removedKey, ...current } = replies;
    setReplies(current);

    // REMOVE REPLY MATCHING SAME ID
    setReplyingTo([...replyingTo.filter(c => c !== commentId)]);
  }

  function replyToComment(commentId) {

    // CANCEL REPLY
    if (replyingTo.includes(commentId)) {
      resetReplyState(commentId);
    }
    // POST REPLY
    else {
      setReplyingTo([...replyingTo, commentId]);
    }
  }

  async function submitReply(event, commentId) {

    event.preventDefault();

    if (!replies[commentId] || !globalUser) {
      return;
    }

    const replyInfo = {
      content: replies[commentId],
      userId: globalUser.uid,
      reply: true,
      replies: []
    }

    await addComment(replyInfo, commentId);
    resetReplyState(commentId);
  }



  async function deleteComment(commentId) {

    if (!commentId) {
      return;
    }

    await removeComment(commentId);
  }

  function renderReplies(replies) {
    if (!replies || replies.length === 0) {
      return null;
    }

    return replies.map((replyId) => {

      const reply = comments.find((c) => c.id === replyId);

      if (!reply) {
        return null;
      }

      return (
        <ul key={reply.id}>
          <li>
            <Comment comment={reply} comments={comments} />
          </li>
        </ul>
      )
    });
  };

  return (
    <div>
      <p>{comment.firstName} {comment.lastName.charAt(0)} &#183; {comment.date}</p>
      <p>"{comment.content}"</p>

      <button onClick={() => likeComment(comment.id)}>
        <i className="fa-solid fa-thumbs-up"></i>
        {comment.numLikes}
      </button>
      <button onClick={() => dislikeComment(comment.id)}>
        <i className="fa-solid fa-thumbs-down"></i>
        {comment.numDislikes}
      </button>

      {globalUser && globalUser.uid === comment.userId && (
        <button onClick={() => deleteComment(comment.id)}>
          Delete
        </button>
      )}

      {globalUser && (

        <div>
          <button onClick={() => replyToComment(comment.id)}>
            Reply
          </button>

          {replyingTo.includes(comment.id) &&

            <form onSubmit={(event) => submitReply(event, comment.id)}>
              <label htmlFor="reply">Reply</label>
              <input
                name="reply"
                type="text"
                value={replies[comment.id] || ""}
                onChange={(event) => {
                  setReplies((reply) => ({
                    ...reply,
                    [comment.id]: event.target.value
                  }));
                }}
              />
              <button type="submit">
                Submit
              </button>
              <button onClick={() => replyToComment(comment.id)}>
                Cancel
              </button>
            </form>
          }
        </div>
      )
      }

      {renderReplies(comment.replies)}
    </div >
  );
}