import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';

export default function Sorter({ comments, setComments }) {

  const [showSort, setShowSort] = useState(false);
  const sorterRef = useRef(null);

  function sortComments(sortValue) {
    const sortedComments = comments.sort((a, b) => {

      if (sortValue === "newest") {
        return b.createdAt - a.createdAt;
      }

      if (sortValue === "oldest") {
        return a.createdAt - b.createdAt;
      }

      // Sort by likes, then by date, then by userId
      if (sortValue === "best") {
        return b.likes.length - a.likes.length || b.createdAt - a.createdAt || a.userId.localeCompare(b.userId);
      }

      // Sort by dislikes, then by date, then by userId
      if (sortValue === "worst") {
        return b.dislikes.length - a.dislikes.length || b.createdAt - a.createdAt || a.userId.localeCompare(b.userId);
      }

      // Sort by dislikes, then by date, then by userId
      if (sortValue === "replies") {
        return b.replies.length - a.replies.length || b.createdAt - a.createdAt || a.userId.localeCompare(b.userId);
      }

      // Default case to handle unexpected sort values
      return 0;
    });

    setComments([...sortedComments]);
    setShowSort(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {

      // Check if sorter is active and if user clicks outside of sorter
      if (sorterRef.current && !sorterRef.current.contains(event.target)) {
        setShowSort(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [sorterRef]);

  return (
    <div className="relative w-fit" ref={sorterRef}>

      <button
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => { setShowSort(!showSort); }}
      >
        <FontAwesomeIcon icon={faSort} />
        <p>Sort by</p>
      </button>

      <div
        className={`absolute left-0 right-0 w-fit bg-white shadow-lg rounded-lg 
        overflow-hidden transition-all duration-300 ease-in-out
        ${showSort ? "max-h-screen p-2" : "max-h-0"}`}
      >
        <button
          className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
          onClick={() => { sortComments("newest"); }}
        >
          Newest
        </button>

        <button
          className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
          onClick={() => { sortComments("oldest") }}
        >
          Oldest
        </button>

        <button
          className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
          onClick={() => { sortComments("best") }}
        >
          Best
        </button>

        <button
          className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
          onClick={() => { sortComments("worst") }}
        >
          Controversial
        </button>

        <button
          className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
          onClick={() => { sortComments("replies") }}
        >
          Replied to
        </button>
      </div>
    </div>
  );
}