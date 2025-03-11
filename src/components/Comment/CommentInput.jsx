import { memo, useRef } from "react";

function CommentInput({ isReplying, postComment }) {

  const inputComment = useRef(null);

  function submit(event) {
    postComment(event, inputComment.current.value)
    inputComment.current.value = "";
  }

  return (
    <form
      className={`flex flex-wrap gap-1  ${isReplying && 'pt-2 pl-4'}`}
      onSubmit={(event) => submit(event)}
    >
      <input
        className="basis-full border-1 border-transparent focus:outline-none focus:border-b-1 focus:border-b-black"
        placeholder={isReplying ? "Add a reply..." : "Add a comment..."}
        ref={inputComment}
      />

      <div className="basis-full justify-end flex gap-1">
        <button
          className="py-1.5 px-3 rounded-full hover:bg-gray-300"
          type="submit"
        >
          {isReplying ? "Reply" : "Post"}
        </button>

        <button
          className="py-1.5 px-3 rounded-full hover:bg-gray-300"
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

// Wraps with Memo to only re-render if props are different
export default memo(CommentInput);