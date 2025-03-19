import Comment from "../Comment/Comment";

export default function ReplyList(props) {
  const { replies, comments, setComments } = props;

  if (!replies?.length) return null;

  return (
    <ul className="flex flex-col">
      {replies.map((replyId) => {
        const reply = comments.find((c) => c.id === replyId);
        return (
          reply && (
            <li key={reply.id}>
              <Comment
                comment={reply}
                comments={comments}
                setComments={setComments}
              />
            </li>
          )
        );
      })}
    </ul>
  );
}
