import { useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Comment(props) {

  const { comment, comments } = props;
  const commentId = comment.id;
  const { globalUser, likeComment, dislikeComment, addComment, removeComment } = useAuthContext();

  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const inputReply = useRef(null);

  const replyLimit = 5;

  async function submitReply(event) {

    event.preventDefault();

    if (!inputReply.current.value || !globalUser) {
      return;
    }

    const replyInfo = {
      content: inputReply.current.value,
      userId: globalUser.uid,
      replyingTo: commentId,
      replies: []
    }

    await addComment(replyInfo, commentId);

    inputReply.current.value = "";
    setIsReplying(false);
    setShowReplies(true);

    if (comment.replies.length > replyLimit) {
      setShowMoreReplies(true);
    }
  }

  async function deleteComment() {
    inputReply.current.value = "";
    setIsReplying(false);

    await removeComment(commentId);
  }

  function renderReplies(replies) {
    if (!replies || replies.length === 0) {
      return null;
    }

    if (replies.length > replyLimit && !showMoreReplies) {
      replies = replies.slice(0, replyLimit - 1);
    }

    return replies.map((replyId) => {

      const reply = comments.find((c) => c.id === replyId);

      if (!reply) {
        return null;
      }

      return (
        <li key={reply.id}>
          <Comment comment={reply} comments={comments} />
        </li>
      );
    });
  }

  return (
    <div>
      <p>{comment.firstName} {comment.lastName.charAt(0)} &#183; {comment.date}</p>
      <p>"{comment.content}"</p>

      <button onClick={() => likeComment(commentId)}>
        <i className="fa-solid fa-thumbs-up" />
        {comment.numLikes}
      </button>
      <button onClick={() => dislikeComment(commentId)}>
        <i className="fa-solid fa-thumbs-down" />
        {comment.numDislikes}
      </button>

      <button onClick={() => setIsReplying(!isReplying)}>
        <i className="fa-solid fa-reply" />
        Reply
      </button>

      {globalUser && globalUser.uid === comment.userId && (
        <button onClick={() => deleteComment()}>
          Delete
        </button>
      )}

      {globalUser && isReplying && (
        <form onSubmit={(event) => submitReply(event)}>
          <label htmlFor="reply">Reply</label>
          <input
            name="reply"
            type="text"
            ref={inputReply}
          />
          <button type="submit">
            Submit
          </button>
          <button onClick={() => setIsReplying(false)}>
            Cancel
          </button>
        </form>
      )
      }



      <div>
        {comment.replies && comment.replies.length > 0 && (
          <button onClick={() => {
            setShowReplies(!showReplies)
            setShowMoreReplies(false);
          }}>
            {showReplies ?
              <div>
                <i className="fa-solid fa-angle-up" />
                {
                  (comment.replies.length == 1 ?
                    "1 reply" :
                    comment.replies.length + " replies"
                  )
                }
              </div> :
              <div>
                <i className="fa-solid fa-angle-down" />
                {
                  (comment.replies.length == 1 ?
                    "1 reply" :
                    comment.replies.length + " replies"
                  )
                }
              </div>
            }
          </button>
        )}
      </div>

      {showReplies &&
        <div>
          <ul>
            {renderReplies(comment.replies)}
          </ul>

          {!showMoreReplies && comment.replies.length > replyLimit &&
            <button onClick={() => setShowMoreReplies(true)}>
              <i className="fa-solid fa-angles-down" />
              Show all {comment.replies.length} replies
            </button>
          }
        </div>
      }
    </div>
  );
}