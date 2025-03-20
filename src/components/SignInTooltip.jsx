import { useEffect, useRef } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function SignInTooltip({ isVisible, onClose }) {
  const { setIsModalOpen } = useAuthContext();
  const tooltipRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) {
    return;
  }

  return (
    <div
      ref={tooltipRef}
      className="absolute z-10 mt-2 flex flex-col gap-2 rounded bg-gray-800 p-3 whitespace-nowrap text-white shadow-lg"
    >
      <p>Please sign in to continue</p>
      <button
        className="w-fit rounded-2xl px-2 py-1 text-blue-500 hover:bg-blue-500/25"
        onClick={() => {
          setIsModalOpen(true);
          onClose();
        }}
      >
        Sign in
      </button>
    </div>
  );
}
