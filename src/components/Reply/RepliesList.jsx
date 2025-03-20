import { useCommentsContext } from "../../context/Comments/CommentsContext";
import Comment from "../Comment/Comment";

export default function RepliesList({ replies }) {
  const { comments } = useCommentsContext();

  if (!replies?.length) return null;

  return (
    <ul className="flex flex-col">
      {replies.map((replyId) => {
        const reply = comments.find((c) => c.id === replyId);
        return (
          reply && (
            <div key={reply.id}>
              <Comment comment={reply} />
            </div>
          )
        );
      })}
    </ul>
  );
}
