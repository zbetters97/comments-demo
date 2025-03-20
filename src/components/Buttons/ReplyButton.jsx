import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import SignInTooltip from "../SignInTooltip";

export default function ReplyButton({ isReplying, setIsReplying }) {
  const { globalUser } = useAuthContext();
  const [showTooltip, setShowTooltip] = useState(false);

  function toggleReply(event) {
    event.stopPropagation();

    if (!globalUser) {
      setShowTooltip(!showTooltip);
      return;
    }

    setIsReplying(!isReplying);
  }

  return (
    <div className="relative">
      <button
        className="rounded-full px-3 py-1 align-top hover:bg-gray-300"
        onClick={toggleReply}
      >
        <p>Reply</p>
      </button>

      <SignInTooltip
        isVisible={showTooltip}
        onClose={() => setShowTooltip(false)}
      />
    </div>
  );
}
