import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { getTimeSince } from "../../utils/date";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import DeleteButton from "./DeleteButton";
import CommentInput from "./CommentInput";
import Replies from "../Replies/Replies";

export default function Comment({ comment }) {
  const { globalUser } = useAuthContext();
  const [isReplying, setIsReplying] = useState(false);

  function toggleReply() {
    if (!globalUser) return;
    setIsReplying(!isReplying);
  }

  return (
    <div className="py-1">
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
          <LikeButton comment={comment} />
          <DislikeButton comment={comment} />

          <button
            className="rounded-full px-3 py-1 hover:bg-gray-300"
            onClick={toggleReply}
          >
            Reply
          </button>

          {globalUser && globalUser.uid === comment.userId && (
            <DeleteButton comment={comment} />
          )}
        </div>
      </div>

      {isReplying && globalUser && (
        <CommentInput
          comment={comment}
          isReplying={isReplying}
          setIsReplying={setIsReplying}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Replies comment={comment} />
      )}
    </div>
  );
}
