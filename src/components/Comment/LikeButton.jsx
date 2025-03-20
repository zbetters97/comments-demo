import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function LikeButton({ comment }) {
  const { globalUser, likeComment, updateCommentState } = useAuthContext();
  const [isLiked, setIsLiked] = useState(false);

  async function handleLike() {
    if (!globalUser) return;

    if (!comment.likes.includes(globalUser.uid)) {
      setIsLiked(true);
      setTimeout(() => setIsLiked(false), 500);
    }

    const updatedComment = await likeComment(comment.id, globalUser.uid);
    updateCommentState(comment, updatedComment);
  }

  return (
    <button
      className={`flex w-12 items-center gap-1 font-light ${globalUser && comment.likes.includes(globalUser.uid) && `text-blue-700`} `}
      onClick={handleLike}
    >
      <FontAwesomeIcon
        icon={faThumbsUp}
        className={`text-lg ${isLiked && `fa-beat`}`}
      />
      <p>{comment.likes.length}</p>
    </button>
  );
}
