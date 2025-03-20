import { useAuthContext } from "../../context/AuthContext";
import { useCommentsContext } from "../../context/CommentsContext";
import { memo, useRef } from "react";

function CommentInput({ comment, isReplying, setIsReplying }) {
  const { globalUser, globalData } = useAuthContext();
  const { setComments, addComment } = useCommentsContext();
  const inputComment = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const content = inputComment.current?.value.trim();
    if (!content || !globalUser) return;

    const commentId = comment?.id || "";
    const commentInfo = {
      content,
      userId: globalUser.uid,
      likes: [],
      dislikes: [],
      replyingTo: commentId,
      replies: [],
    };

    const newComment = await addComment(commentInfo, commentId);
    if (comment) comment.replies.push(newComment.id);

    setComments((prevData) => [
      {
        id: newComment.id,
        ...newComment.data(),
        username: globalData.username,
      },
      ...prevData,
    ]);

    closeComment();
  }

  function closeComment() {
    inputComment.current.value = "";

    if (isReplying) {
      setIsReplying(false);
    }
  }

  return (
    <form
      className={`flex flex-wrap gap-1 ${isReplying && "pt-2 pl-4"}`}
      onSubmit={handleSubmit}
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
          onClick={closeComment}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Wraps with memo to only re-render if props are different
export default memo(CommentInput);
