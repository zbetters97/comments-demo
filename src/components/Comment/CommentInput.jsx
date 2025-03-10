import { memo, useRef } from "react";

function CommentInput({ isReplying, postComment }) {

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

// Wraps with Memo to only re-render if props are different
export default memo(CommentInput);