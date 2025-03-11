import { useMemo } from "react";
import CommentCard from "./CommentCard";

export default function CommentList({ comments }) {

  // Freeze topComments until comments data changes
  const topComments = useMemo(

    // Only show non-reply comments
    () => comments.filter((comment) => comment.replyingTo === "") || null,
    [comments]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Loop through each comment and create new component*/}
      {topComments.map((comment) => {
        return (
          <ul key={comment.id}>
            <li>
              <CommentCard comment={comment} comments={comments} />
            </li>
          </ul>
        );
      })}
    </div>
  );
}