import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ToggleButton(props) {
  const { isOpen, onClick, iconOpen, iconClose, labelOpen, labelClose } = props;

  return (
    <button
      onClick={onClick}
      className="mb-2 flex items-center justify-center gap-2 rounded-full px-3 py-1.5 font-semibold text-blue-800 hover:bg-blue-100"
    >
      <FontAwesomeIcon icon={isOpen ? iconOpen : iconClose} />
      <p className="text-sm">{isOpen ? labelOpen : labelClose}</p>
    </button>
  );
}
