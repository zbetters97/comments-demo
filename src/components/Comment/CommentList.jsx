import { useMemo } from "react";
import { useCommentsContext } from "../../context/Comments/CommentsContext";
import Comment from "./Comment";

export default function CommentList() {
  const { comments } = useCommentsContext();

  // Memoize topComments until comments data changes
  const topComments = useMemo(
    // Only show non-reply comments
    () => comments.filter((comment) => comment.replyingTo === "") || null,
    [comments],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Loop through each comment and create new component*/}
      {topComments.map((comment) => {
        return (
          <div key={comment.id}>
            <Comment comment={comment} />
          </div>
        );
      })}
    </div>
  );
}
