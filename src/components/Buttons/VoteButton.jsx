import { useAuthContext } from "../../context/Auth/AuthContext";
import { useCommentsContext } from "../../context/Comments/CommentsContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SignInTooltip from "../SignInTooltip";

export default function VoteButton({ comment, type, icon, color }) {
  const { globalUser } = useAuthContext();
  const { likeComment, dislikeComment, updateCommentState } =
    useCommentsContext();
  const [isActive, setIsActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const userVoted = globalUser
    ? type === "like"
      ? comment.likes.includes(globalUser.uid)
      : comment.dislikes.includes(globalUser.uid)
    : false;

  async function voteComment(event) {
    event.stopPropagation();

    if (!globalUser) {
      setShowTooltip(!showTooltip);
      return;
    }

    if (!userVoted) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    const updatedComment =
      type === "like"
        ? await likeComment(comment.id, globalUser.uid)
        : await dislikeComment(comment.id, globalUser.uid);

    updateCommentState(comment, updatedComment);
  }

  return (
    <div className="relative">
      <button
        className={`flex w-12 items-center gap-1 font-light ${
          globalUser && userVoted && color
        }`}
        onClick={voteComment}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`text-lg ${isActive && `fa-beat`}`}
        />
        <p>
          {type === "like" ? comment.likes.length : comment.dislikes.length}
        </p>
      </button>

      <SignInTooltip
        isVisible={showTooltip}
        onClose={() => setShowTooltip(false)}
      />
    </div>
  );
}
