import { memo, useRef } from "react";

function CommentInput({ isReplying, postComment }) {
  const inputComment = useRef(null);

  function submit(event) {
    postComment(event, inputComment.current.value);
    inputComment.current.value = "";
  }

  return (
    <form
      className={`flex flex-wrap gap-1 ${isReplying && "pt-2 pl-4"}`}
      onSubmit={(event) => submit(event)}
    >
      <input
        className="basis-full border-1 border-transparent border-b-gray-400 focus:border-b-1 focus:border-b-black focus:outline-none"
        placeholder={isReplying ? "Add a reply..." : "Add a comment..."}
        ref={inputComment}
      />

      <div className="flex basis-full justify-end gap-1">
        <button
          className="rounded-full px-3 py-1.5 hover:bg-gray-300"
          type="submit"
        >
          {isReplying ? "Reply" : "Post"}
        </button>

        <button
          className="rounded-full px-3 py-1.5 hover:bg-gray-300"
          onClick={() => {
            inputComment.current.value = "";
            isReplying && isReplying(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Wraps with memo to only re-render if props are different
export default memo(CommentInput);
