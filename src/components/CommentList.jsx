import Comment from "./Comment";

export default function CommentList(props) {

  const { comments } = props;

  return (
    <div>
      {/* ONLY SHOW NON-REPLY COMMENTS */}
      {/* LOOP THROUGH EACH COMMENT AND CREATE Comment COMPONENT*/}
      {comments.filter((comment) => !comment.reply).map((comment) => (
        <ul key={comment.id}>
          <li>
            <Comment comment={comment} comments={comments} />
          </li>
        </ul>
      ))}
    </div>
  );
}