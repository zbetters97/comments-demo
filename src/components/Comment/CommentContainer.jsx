import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import CommentInput from "./CommentInput";

export default function CommentContainer(props) {

  const { comment, comments } = props;
  const commentId = comment.id;
  const replyLimit = 5;

  const { globalUser, likeComment, dislikeComment, addComment, removeComment } = useAuthContext();

  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  function renderReplies(replies) {

    if (!replies || replies.length === 0) {
      return null;
    }

    if (replies.length > replyLimit && !showMoreReplies) {
      replies = replies.slice(0, replyLimit);
    }

    return replies.map((replyId) => {

      const reply = comments.find((c) => c.id === replyId);

      if (!reply) {
        return null;
      }

      return (
        <li key={reply.id}>
          <CommentContainer comment={reply} comments={comments} />
        </li>
      );
    });
  }

  async function submitReply(event, content) {

    event.preventDefault();

    if (!content || !globalUser) {
      return;
    }

    const replyInfo = {
      content: content,
      userId: globalUser.uid,
      replyingTo: commentId,
      replies: []
    }

    await addComment(replyInfo, commentId);

    setIsReplying(false);
    setShowReplies(true);

    if (comment.replies.length > replyLimit) {
      setShowMoreReplies(true);
    }
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

      {globalUser && (
        <>
          <button onClick={() => setIsReplying(!isReplying)}>
            <i className="fa-solid fa-reply" />
            Reply
          </button>

          {globalUser && globalUser.uid === comment.userId &&
            <button onClick={async () => await removeComment(commentId)}>
              Delete
            </button>
          }
        </>)
      }

      {globalUser && isReplying && (
        <CommentInput postComment={submitReply} isReplying={setIsReplying} />)
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
                {(comment.replies.length == 1 ?
                  "1 reply" :
                  comment.replies.length + " replies"
                )}
              </div> :
              <div>
                <i className="fa-solid fa-angle-down" />
                {(comment.replies.length == 1 ?
                  "1 reply" :
                  comment.replies.length + " replies"
                )}
              </div>
            }
          </button>)
        }
      </div>

      {showReplies && (
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
        </div>)
      }
    </div>
  );
}