import { useState } from "react";
import RepliesToggle from "./RepliesToggle";
import RepliesList from "./RepliesList";
import {
  faAngleUp,
  faAngleDown,
  faAnglesDown,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";

export default function Replies({ comment }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showMoreReplies, setShowMoreReplies] = useState(false);

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
      <RepliesToggle
        onClick={toggleReplies}
        isOpen={showReplies}
        iconOpen={faAngleUp}
        iconClose={faAngleDown}
        labelOpen={`${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
        labelClose={`${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
      />

      {showReplies && (
        <div className="ml-6">
          <RepliesList replies={repliesToShow} />

          {comment.replies.length > replyLimit && (
            <RepliesToggle
              onClick={toggleMoreReplies}
              isOpen={showMoreReplies}
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
