import { useAuthContext } from "../../context/Auth/AuthContext";
import { useState } from "react";
import { getTimeSince } from "../../utils/date";
import VoteButton from "../Buttons/VoteButton";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import ReplyButton from "../Buttons/ReplyButton";
import DeleteButton from "../Buttons/DeleteButton";
import CommentInput from "../Inputs/CommentInput";
import Replies from "../Reply/Replies";

export default function Comment({ comment }) {
  const { globalUser } = useAuthContext();
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="py-1">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 text-sm">
            <p className="cursor-pointer font-semibold">@{comment.username}</p>
            <p className="font-light">
              {getTimeSince(comment.createdAt.toDate())}
            </p>
          </div>
          <p className="text-xl">{comment.content}</p>
        </div>

        <div className="ml-1 flex items-center">
          <VoteButton
            comment={comment}
            type="like"
            icon={faThumbsUp}
            color="text-blue-700"
          />
          <VoteButton
            comment={comment}
            type="dislike"
            icon={faThumbsDown}
            color="text-red-700"
          />

          <ReplyButton isReplying={isReplying} setIsReplying={setIsReplying} />

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

      <Replies comment={comment} />
    </div>
  );
}
