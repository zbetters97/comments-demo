import { useAuthContext } from "../context/AuthContext";
import { useCommentsContext } from "../context/CommentsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ModalButton from "../components/Buttons/ModalButton";
import SortButton from "../components/Buttons/SortButton";
import CommentInput from "../components/Inputs/CommentInput";
import CommentList from "../components/Comment/CommentList";

export default function CommentsPage() {
  const { globalUser, globalData } = useAuthContext();
  const { comments } = useCommentsContext();

  if (!comments) {
    return (
      <div
        className="align-center flex w-full flex-col justify-center gap-4 text-center text-4xl"
        style={{ height: "80vh" }}
      >
        <FontAwesomeIcon className="text-stone-500" icon={faSpinner} spin />
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-screen p-4">
      <div className="align-center m-auto flex w-1/1 justify-between p-4">
        {globalData && globalUser && (
          <h1 className="text-lg">Hello, {globalData.firstName}</h1>
        )}

        <ModalButton />
      </div>

      <div className="mb-2 ml-2 flex flex-col gap-4">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>

        {comments.length > 0 && <SortButton />}
      </div>

      <div className="w-10/12 p-4">
        {globalUser && <CommentInput />}
        <CommentList />
      </div>

      {comments.length === 0 && (
        <p className="m-auto text-center text-3xl text-stone-500">
          No comments yet!
        </p>
      )}
    </div>
  );
}
