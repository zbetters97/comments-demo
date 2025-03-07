import CommentContainer from "./CommentContainer";

export default function CommentList(props) {

  const { comments } = props;

  return (
    <div>
      {/* ONLY SHOW NON-REPLY COMMENTS */}
      {/* LOOP THROUGH EACH COMMENT AND CREATE Comment COMPONENT*/}
      {comments.filter((comment) => comment.replyingTo === "").map((comment) => (
        <ul key={comment.id}>
          <li>
            <CommentContainer comment={comment} comments={comments} />
          </li>
        </ul>
      ))}
    </div>
  );
}