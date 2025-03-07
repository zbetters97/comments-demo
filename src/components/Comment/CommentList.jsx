import CommentContainer from "./CommentContainer";

export default function CommentList(props) {

  const { comments } = props;

  return (
    <div>
      {/* Only show non-reply comments */}
      {/* Loop through each comment and create new component*/}
      {comments.filter((comment) => comment.replyingTo === "").map((comment) => {
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