import { useRef } from "react";

export default function CommentInput(props) {

  const { isReplying, postComment } = props;

  const inputComment = useRef(null);

  function submit(event) {
    postComment(event, inputComment.current.value)
    inputComment.current.value = "";
  }

  return (
    <form onSubmit={(event) => submit(event)}>
      <input
        name="comment"
        type="text"
        ref={inputComment}
      />

      <button type="submit">
        Submit
      </button>

      <button onClick={() => {
        inputComment.current.value = "";
        isReplying && isReplying(false);
      }}>
        Cancel
      </button>
    </form>
  );
}