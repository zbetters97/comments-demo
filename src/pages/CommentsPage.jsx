import { useAuthContext } from "../context/AuthContext";
import ModalButton from "../components/Form/ModalButton";
import Sorter from "../components/Sorter";
import CommentInput from "../components/Comment/CommentInput";
import CommentList from "../components/Comment/CommentList";

export default function CommentsPage() {
  const { globalUser, globalData, comments } = useAuthContext();

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

        {comments.length > 0 && <Sorter />}
      </div>

      <div className="w-10/12 p-4">
        {globalUser && <CommentInput />}
        <CommentList />
      </div>

      {comments.length === 0 && (
        <p className="m-auto text-center text-2xl">No comments yet!</p>
      )}
    </div>
  );
}
