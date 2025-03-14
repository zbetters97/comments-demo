import { useCallback, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import CommentInput from "./CommentInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faAngleUp, faAngleDown, faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { getTimeSince } from "../../utils/date";

export default function Comment({ comment, comments, setComments }) {

  const commentId = comment.id;
  const replyLimit = 5;

  const { globalUser, globalData, likeComment, dislikeComment, getComments, addComment, removeComment } = useAuthContext();

  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  async function submitLike() {

    if (globalUser) {

      // Find comment in existing array
      const existingComment = comments.find(comment => comment.id === commentId);

      // Play animation if user dislikes for first time
      if (!existingComment.likes.includes(globalUser.uid)) {

        setIsLiked(true);
        setTimeout(() => {
          setIsLiked(false)
        }, 500);
      }

      // Get new data from liked comment
      const likedComment = await likeComment(commentId);

      // Merge new data into existing comment
      Object.assign(existingComment, likedComment);

      // Update useState with new comment data
      setComments(comments.map(comment => comment.id === commentId ? existingComment : comment));
    }
  }
  async function submitDislike() {

    if (globalUser) {

      // Find comment in existing array
      const existingComment = comments.find(comment => comment.id === commentId);

      // Play animation if user dislikes for first time
      if (!existingComment.dislikes.includes(globalUser.uid)) {

        setIsDisliked(true);
        setTimeout(() => {
          setIsDisliked(false)
        }, 500);
      }

      // Get new data from liked comment
      const dislikedComment = await dislikeComment(commentId);

      // Merge new data into existing comment
      Object.assign(existingComment, dislikedComment);

      // Update useState with new comment data
      setComments(comments.map(comment => comment.id === commentId ? existingComment : comment));
    }
  }
  async function deleteComment(commentId) {

    // Find comment to delete from useState
    const deletedComment = comments.find(comment => comment.id === commentId);

    // Remove comment from Firestore
    await removeComment(commentId);

    // Comment was a reply
    if (deletedComment.replyingTo) {

      // Find parent comment and remove reply ID
      const parentComment = comments.find(comment => comment.id === deletedComment.replyingTo);
      parentComment.replies = parentComment.replies.filter(reply => reply !== commentId);

      // Update useState with new comment data
      setComments(comments.map(comment => comment.id === deletedComment.replyingTo ? parentComment : comment));
    }

    // Retrieve updated comment data from Firestore
    const commentsData = await getComments();

    // Compare existing comments with Firestore data and delete extras
    const updatedComments = comments.filter(comment =>
      commentsData.some(data => data.id === comment.id)
    );

    // Update useState comment data
    setComments(updatedComments);
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
          <Comment comment={reply} comments={comments} setComments={setComments} />
        </li>
      );
    });
  }

  // Memoizes function to prevent re-render of CommentInput unless comments change
  const submitReply = useCallback(async (event, content) => {

    event.preventDefault();

    if (!content || !globalUser) {
      return;
    }

    const reply = {
      content: content,
      userId: globalUser.uid,
      likes: [],
      dislikes: [],
      replyingTo: commentId,
      replies: []
    }

    // Get generated ID from Firestore
    const newReply = await addComment(reply, commentId);

    // Find parent comment and add ID to replies array
    const repliedComment = comments.find(comment => comment.id === commentId);
    repliedComment.replies.push(newReply.id);

    // Update useState with new comment data
    setComments(comments.map(comment => comment.id === commentId ? repliedComment : comment));
    setComments(prevData => [
      ...prevData,
      {
        id: newReply.id,
        ...newReply.data(),
        username: globalData.username
      }
    ]);

    setIsReplying(false);
    setShowReplies(true);

    if (repliedComment.replies.length > replyLimit) {
      setShowMoreReplies(true);
    }
  }, [comments]);

  return (
    <div className="flex flex-col">
      <div className="text-sm flex gap-2">
        <p className="font-semibold cursor-pointer">
          @{comment.username}
        </p>
        <p className="font-light">
          {getTimeSince(comment.createdAt.toDate())}
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
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={`text-lg ${isLiked && `fa-beat`}`}
          />
          <p>{comment.likes.length}</p>
        </button>

        <button
          className={`
            font-light flex gap-1 items-center w-12
            ${globalUser && comment.dislikes.includes(globalUser.uid) && `text-red-700`}
          `}
          onClick={() => submitDislike()}
        >
          <FontAwesomeIcon
            icon={faThumbsDown}
            className={`text-lg ${isDisliked && `fa-beat`}`}
          />
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
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this comment?')) {
                    await deleteComment(commentId);
                  }
                }}
              >
                Delete
              </button>)
            }
          </div>)
        }
      </div>

      {
        globalUser && isReplying && (
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
                  <FontAwesomeIcon icon={faAngleUp} />
                  {(comment.replies.length == 1 ?
                    "1 reply" :
                    comment.replies.length + " replies"
                  )}
                </>) : (
                <>
                  <FontAwesomeIcon icon={faAngleDown} />
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

          {comment.replies.length > replyLimit && (
            <>
              {showMoreReplies ? (
                <button
                  className="font-semibold text-blue-800 py-1 px-2 rounded-full flex items-center gap-1 mb-2 hover:bg-blue-200"
                  onClick={() => setShowMoreReplies(false)}
                >
                  <FontAwesomeIcon icon={faAnglesUp} />
                  Show less replies
                </button>
              ) : (
                <button
                  className="font-semibold text-blue-800 py-1 px-2 rounded-full flex items-center gap-1 mb-2 hover:bg-blue-200"
                  onClick={() => setShowMoreReplies(true)}
                >
                  <FontAwesomeIcon icon={faAnglesDown} />
                  Show all replies
                </button>)
              }
            </>)
          }
        </div>)
      }
    </div >
  );
}