import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="mt-20 flex flex-col items-center gap-4 text-center">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="text-6xl text-red-500"
      />

      <h1 className="text-3xl font-bold">Error! Something went wrong!</h1>

      <Link to="/">
        <p className="w-fit rounded-full bg-gray-300 px-5 py-3 text-xl">
          Go to home
        </p>
      </Link>
    </div>
  );
}
