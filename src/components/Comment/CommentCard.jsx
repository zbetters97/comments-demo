import { useAuthContext } from "../../context/AuthContext";
import { getTimeSince } from "../../utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

export default function CommentCard({
  comment,
  isLiked,
  handleLike,
  isDisliked,
  handleDislike,
  isReplying,
  setIsReplying,
  handleDelete,
}) {
  const { globalUser } = useAuthContext();

  function toggleReply() {
    if (!globalUser) return;
    setIsReplying(!isReplying);
  }

  function renderLikeButton() {
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

  function renderDislikeButton() {
    return (
      <button
        className={`flex w-12 items-center gap-1 font-light ${globalUser && comment.dislikes.includes(globalUser.uid) && `text-red-700`} `}
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 text-sm">
          <p className="cursor-pointer font-semibold">@{comment.username}</p>
          <p className="font-light">
            {getTimeSince(comment.createdAt.toDate())}
          </p>
        </div>
        <p className="text-xl">{comment.content}</p>
      </div>

      <div className="ml-1 flex">
        {renderLikeButton()}
        {renderDislikeButton()}

        <button
          className="rounded-full px-3 py-1 hover:bg-gray-300"
          onClick={toggleReply}
        >
          Reply
        </button>
        {globalUser && globalUser.uid === comment.userId && (
          <button
            className="rounded-full px-3 py-1 hover:bg-gray-300"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
