import { useCommentsContext } from "../../context/CommentsContext";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

export default function SortButton() {
  const { comments, setComments } = useCommentsContext();
  const [showSort, setShowSort] = useState(false);
  const sorterRef = useRef(null);

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Best", value: "best" },
    { label: "Controversial", value: "worst" },
    { label: "Replied to", value: "replies" },
  ];

  function sortComments(sortValue) {
    const sortedComments = comments.sort((a, b) => {
      switch (sortValue) {
        case "newest":
          return b.createdAt - a.createdAt;

        case "oldest":
          return a.createdAt - b.createdAt;

        case "best":
          return (
            b.likes.length - a.likes.length ||
            a.dislikes.length - b.dislikes.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        case "worst":
          return (
            b.dislikes.length - a.dislikes.length ||
            a.likes.length - b.likes.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        case "replies":
          return (
            b.replies.length - a.replies.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        default:
          return 0;
      }
    });

    setComments([...sortedComments]);
    setShowSort(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (sorterRef.current && !sorterRef.current.contains(event.target)) {
        setShowSort(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-20 w-fit" ref={sorterRef}>
      <button
        className="flex cursor-pointer items-center gap-1"
        onClick={() => setShowSort(!showSort)}
      >
        <FontAwesomeIcon icon={faSort} />
        <p>Sort by</p>
      </button>

      <div
        className={`absolute right-0 left-0 w-fit overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out ${
          showSort ? "max-h-screen p-2" : "max-h-0"
        }`}
      >
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className="w-full rounded-sm px-3 py-1 text-left transition-all hover:bg-gray-300"
            onClick={() => sortComments(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
