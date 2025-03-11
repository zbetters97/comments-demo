import { useCallback, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import CommentInput from "./CommentInput";

export default function CommentCard({ comment, comments }) {

  const commentId = comment.id;
  const replyLimit = 5;

  const { globalUser, likeComment, dislikeComment, addComment, removeComment } = useAuthContext();

  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  function submitLike() {
    likeComment(commentId);

    // Play animation if user likes for first time
    if (globalUser && !comment.likes.includes(globalUser.uid)) {
      setIsLiked(true);

      setTimeout(() => {
        setIsLiked(false)
      }, 500);
    }

  }
  function submitDislike() {
    dislikeComment(commentId);

    // Play animation if user dislikes for first time
    if (globalUser && !comment.dislikes.includes(globalUser.uid)) {
      setIsDisliked(true);

      setTimeout(() => {
        setIsDisliked(false)
      }, 500);
    }
  }

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
        <li className="my-1" key={reply.id}>
          <CommentCard comment={reply} comments={comments} />
        </li>
      );
    });
  }

  // Memoizes function to prevent re-render of CommentInput
  const submitReply = useCallback(async (event, content) => {

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
  }, []);

  return (
    <div className="flex flex-col">
      <div className="text-sm flex gap-2">
        <p className="font-semibold cursor-pointer">
          @{comment.firstName} {comment.lastName.charAt(0)}
        </p>
        <p className="font-light">
          {comment.date}
        </p>
      </div>

      <p className="text-xl">
        {comment.content}
      </p>

      <div className="flex gap-3 pt-1">
        <button
          className={`
            font-light flex gap-1 items-center w-12            
            ${globalUser && comment.likes.includes(globalUser.uid) && `text-blue-700`}            
          `}
          onClick={() => submitLike()}
        >
          <i className={`text-lg fa-solid fa-thumbs-up ${isLiked && `fa-beat`}`} />
          <p>{comment.likes.length}</p>
        </button>

        <button
          className={`
            font-light flex gap-1 items-center w-12
            ${globalUser && comment.dislikes.includes(globalUser.uid) && `text-red-700`}
          `}
          onClick={() => submitDislike()}
        >
          <i className={`text-lg fa-solid fa-thumbs-down ${isDisliked && `fa-beat`}`} />
          <p>{comment.dislikes.length}</p>
        </button>


        {globalUser && (
          <div className="flex gap-1">
            <button
              className="py-1.5 px-3 rounded-full hover:bg-gray-300"
              onClick={() => setIsReplying(!isReplying)}
            >
              <p>Reply</p>
            </button>

            {globalUser.uid === comment.userId && (
              <button
                className="py-1.5 px-3 rounded-full hover:bg-gray-300"
                onClick={async () => await removeComment(commentId)}
              >
                Delete
              </button>)
            }
          </div>)
        }
      </div>

      {globalUser && isReplying && (
        <CommentInput postComment={submitReply} isReplying={setIsReplying} />)
      }

      <div>
        {comment.replies && comment.replies.length > 0 && (
          <button onClick={() => {
            setShowReplies(!showReplies)
            setShowMoreReplies(false);
          }}>
            <div
              className="font-semibold text-blue-800 py-1 px-2 rounded-full flex items-center gap-1 mb-2 hover:bg-blue-200"
            >
              {showReplies ? (
                <>
                  <i className="fa-solid fa-angle-up" />
                  {(comment.replies.length == 1 ?
                    "1 reply" :
                    comment.replies.length + " replies"
                  )}
                </>) : (
                <>
                  <i className="fa-solid fa-angle-down" />
                  {(comment.replies.length == 1 ?
                    "1 reply" :
                    comment.replies.length + " replies"
                  )}
                </>)
              }
            </div>
          </button>)
        }
      </div>

      {showReplies && (
        <div className="ml-6" >
          <ul>
            {renderReplies(comment.replies)}
          </ul>

          {!showMoreReplies && comment.replies.length > replyLimit && (
            <button onClick={() => setShowMoreReplies(true)}>
              <i className="fa-solid fa-angles-down" />
              Show all replies
            </button>)
          }
        </div>
      )}
    </div >
  );
}