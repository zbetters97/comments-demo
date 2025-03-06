import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Comment(props) {

  const { comment, comments } = props;
  const { globalUser, likeComment, dislikeComment, addComment } = useAuthContext();

  const [replyingTo, setReplyingTo] = useState([]);
  const [replies, setReplies] = useState({});

  function replyToComment(commentId) {

    // CANCEL REPLY
    if (replyingTo.includes(commentId)) {

      // RESET useState COMMENT REPLY
      const { [commentId]: removedKey, ...current } = replies;
      setReplies(current);

      setReplyingTo([...replyingTo.filter(c => c !== commentId)]);
    }
    else {
      setReplyingTo([...replyingTo, commentId]);
    }
  }

  async function submitReply(commentId) {

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

    // RESET useState COMMENT REPLY
    const { [commentId]: removedKey, ...current } = replies;
    setReplies(current);

    setReplyingTo([...replyingTo.filter(c => c !== commentId)]);
  }

  const renderReplies = (replies) => {
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
      <p>{comment.firstName} {comment.lastName.charAt(0)}. - {comment.date}</p>
      <p>"{comment.content}"</p>

      <button onClick={() => likeComment(comment.id)}>
        <i className="fa-solid fa-thumbs-up"></i>
        {comment.numLikes}
      </button>
      <button onClick={() => dislikeComment(comment.id)}>
        <i className="fa-solid fa-thumbs-down"></i>
        {comment.numDislikes}
      </button>

      {globalUser && (

        <div>
          <button onClick={() => replyToComment(comment.id)}>
            Reply
          </button>

          {replyingTo.includes(comment.id) &&

            <div>
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
              <button onClick={() => submitReply(comment.id)}>
                Submit
              </button>
              <button onClick={() => replyToComment(comment.id)}>
                Cancel
              </button>
            </div>
          }
        </div>
      )}

      {renderReplies(comment.replies)}
    </div>
  );
}