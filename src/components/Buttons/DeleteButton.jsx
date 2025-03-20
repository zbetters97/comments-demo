import { useCommentsContext } from "../../context/Comments/CommentsContext";

export default function DeleteButton({ comment }) {
  const { setComments, getComments, removeComment } = useCommentsContext();

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    await removeComment(comment.id);

    // Update parent comment if this is a reply
    if (comment.replyingTo) {
      setComments((prevComments) =>
        prevComments.map(
          (c) =>
            // If comment is the parent
            c.id === comment.replyingTo
              ? {
                  // Create new object with same data but reply ID filtered out
                  ...c,
                  replies: c.replies.filter((reply) => reply !== comment.id),
                }
              : c, // Return unchanged
        ),
      );
    }

    // Fetch updated comments from Firestore
    const commentsData = await getComments();

    // Filter out any comment from useState not found in Firestore data
    setComments((prevComments) =>
      prevComments.filter((c) => commentsData.some((data) => data.id === c.id)),
    );
  }

  return (
    <button
      className="rounded-full px-3 py-1 hover:bg-gray-300"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
