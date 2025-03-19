import { useCallback, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import CommentInput from "./CommentInput";
import CommentCard from "./CommentCard";
import ReplyList from "../Reply/ReplyList";
import Replies from "../Reply/Replies";

export default function Comment({ comment, comments, setComments }) {
  const {
    globalUser,
    globalData,
    getComments,
    likeComment,
    dislikeComment,
    addComment,
    removeComment,
  } = useAuthContext();

  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  async function handleLike() {
    if (!globalUser) return;

    if (!comment.likes.includes(globalUser.uid)) {
      setIsLiked(true);
      setTimeout(() => setIsLiked(false), 500);
    }

    const updatedComment = await likeComment(comment.id, globalUser.uid);
    updateCommentState(updatedComment);
  }

  async function handleDislike() {
    if (!globalUser) return;

    if (!comment.dislikes.includes(globalUser.uid)) {
      setIsDisliked(true);
      setTimeout(() => setIsDisliked(false), 500);
    }

    const updatedComment = await dislikeComment(comment.id, globalUser.uid);
    updateCommentState(updatedComment);
  }

  function updateCommentState(updatedComment) {
    Object.assign(comment, updatedComment);

    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    await removeComment(comment.id);

    // Update parent comment if this is a reply
    if (comment.replyingTo) {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === comment.replyingTo
            ? {
              ...c,
              replies: c.replies.filter((reply) => reply !== comment.id),
            }
            : c,
        ),
      );
    }

    // Fetch updated comments from Firestore and update state
    const commentsData = await getComments();
    setComments((prevComments) =>
      prevComments.filter((c) => commentsData.some((data) => data.id === c.id)),
    );
  }

  // Memoizes function to prevent re-render of CommentInput
  const handleReplySubmit = useCallback(
    async (event, content) => {
      event.preventDefault();

      if (!content || !globalUser) return;

      const reply = {
        content,
        userId: globalUser.uid,
        likes: [],
        dislikes: [],
        replyingTo: comment.id,
        replies: [],
      };

      const newReply = await addComment(reply, comment.id);
      comment.replies.push(newReply.id);

      setComments((prevData) => [
        ...prevData,
        {
          id: newReply.id,
          ...newReply.data(),
          username: globalData.username,
        },
      ]);

      setIsReplying(false);
      setShowReplies(true);
    },
    [comment.id, globalUser, globalData],
  );

  return (
    <div className="py-1">
      <CommentCard
        comment={comment}
        isLiked={isLiked}
        handleLike={handleLike}
        isDisliked={isDisliked}
        handleDislike={handleDislike}
        isReplying={isReplying}
        setIsReplying={setIsReplying}
        handleDelete={handleDelete}
      />

      {isReplying && globalUser && (
        <CommentInput
          postComment={handleReplySubmit}
          isReplying={setIsReplying}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Replies
          comment={comment}
          comments={comments}
          setComments={setComments}
          showReplies={showReplies}
          setShowReplies={setShowReplies}
          showMoreReplies={showMoreReplies}
          setShowMoreReplies={setShowMoreReplies}
        />
      )}
    </div>
  );
}
