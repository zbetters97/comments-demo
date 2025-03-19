import {
  faAngleUp,
  faAngleDown,
  faAnglesDown,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";
import ReplyList from "./ReplyList";
import ToggleButton from "../ToggleButton";

export default function Replies(props) {
  const {
    comment,
    comments,
    setComments,
    showReplies,
    setShowReplies,
    showMoreReplies,
    setShowMoreReplies,
  } = props;

  const replyLimit = 5;

  const repliesToShow = showMoreReplies
    ? comment.replies
    : comment.replies.slice(0, replyLimit);

  function toggleReplies() {
    setShowReplies(!showReplies);
    setShowMoreReplies(false);
  }

  function toggleMoreReplies() {
    setShowMoreReplies(!showMoreReplies);
  }

  return (
    <div>
      <ToggleButton
        isOpen={showReplies}
        onClick={toggleReplies}
        iconOpen={faAngleUp}
        iconClose={faAngleDown}
        labelOpen={`${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
        labelClose={`${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
      />

      {showReplies && (
        <div className="ml-6">
          <ReplyList
            replies={repliesToShow}
            comments={comments}
            setComments={setComments}
          />

          {comment.replies.length > replyLimit && (
            <ToggleButton
              isOpen={showMoreReplies}
              onClick={toggleMoreReplies}
              iconOpen={faAnglesUp}
              iconClose={faAnglesDown}
              labelOpen="Show less replies"
              labelClose="Show all replies"
            />
          )}
        </div>
      )}
    </div>
  );
}
