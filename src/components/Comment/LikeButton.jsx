import { useAuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SignInTooltip from "../SignInTooltip";

export default function LikeButton({ comment }) {
  const { globalUser, likeComment, updateCommentState } = useAuthContext();
  const [isLiked, setIsLiked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  async function handleLike(event) {
    event.stopPropagation();

    if (!globalUser) {
      setShowTooltip(!showTooltip);
      return;
    }

    if (!comment.likes.includes(globalUser.uid)) {
      setIsLiked(true);
      setTimeout(() => setIsLiked(false), 500);
    }

    const updatedComment = await likeComment(comment.id, globalUser.uid);
    updateCommentState(comment, updatedComment);
  }

  return (
    <div className="relative">
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

      <SignInTooltip
        isVisible={showTooltip}
        onClose={() => setShowTooltip(false)}
      />
    </div>
  );
}
