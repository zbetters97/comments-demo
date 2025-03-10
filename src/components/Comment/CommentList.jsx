import { useMemo } from "react";
import CommentContainer from "./CommentContainer";

export default function CommentList({ comments }) {

  // Freeze topComments until comments data changes
  const topComments = useMemo(

    // Only show non-reply comments
    () => comments.filter((comment) => comment.replyingTo === "") || null,
    [comments]
  );

  return (
    <div>
      {/* Loop through each comment and create new component*/}
      {topComments.map((comment) => {
        return (
          <ul key={comment.id}>
            <li>
              <CommentContainer comment={comment} comments={comments} />
            </li>
          </ul>
        );
      })}
    </div>
  );
}