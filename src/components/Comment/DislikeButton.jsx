import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";

export default function DislikeButton({ comment }) {
  const { globalUser, dislikeComment, updateCommentState } = useAuthContext();
  const [isDisliked, setIsDisliked] = useState(false);

  async function handleDislike() {
    if (!globalUser) return;

    if (!comment.dislikes.includes(globalUser.uid)) {
      setIsDisliked(true);
      setTimeout(() => setIsDisliked(false), 500);
    }

    const updatedComment = await dislikeComment(comment.id, globalUser.uid);
    updateCommentState(comment, updatedComment);
  }

  return (
    <button
      className={`flex w-12 items-center gap-1 font-light ${globalUser && comment.dislikes.includes(globalUser.uid) && `text-red-600`} `}
      onClick={handleDislike}
    >
      <FontAwesomeIcon
        icon={faThumbsDown}
        className={`text-lg ${isDisliked && `fa-beat`}`}
      />
      <p>{comment.dislikes.length}</p>
    </button>
  );
}
