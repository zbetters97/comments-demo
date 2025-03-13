import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

export default function Sorter(props) {

  const { showSort, setShowSort, setSortValue } = props;

  return (
    <div className="relative w-fit">

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
          onClick={() => { setSortValue("createdAt"); setShowSort(false); }}
        >
          Newest
        </button>

        <button
          className="rounded-sm py-1 px-3 transition-all hover:bg-gray-300"
          onClick={() => { setSortValue("numLikes"); setShowSort(false); }}
        >
          Best
        </button>
      </div>
    </div>
  );
}