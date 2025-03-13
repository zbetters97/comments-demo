import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="text-center mt-20 flex flex-col items-center gap-4">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="text-6xl text-red-500"
      />

      <h1 className="text-3xl font-bold">
        Error! Something went wrong!
      </h1>

      <Link to="/">
        <p className="text-xl py-3 px-5 bg-gray-300 rounded-full w-fit">
          Go to home
        </p>
      </Link>
    </div>
  );
}