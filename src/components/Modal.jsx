export default function Modal({ open, onClose, children }) {
  return (
    <div
      className={`fixed inset-0 transition-colors ${open ? "visible bg-black/80" : "invisible"}`}
      onClick={onClose}
    >
      <div
        className={`fixed top-1/2 left-1/2 -translate-1/2 rounded-sm bg-white p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-0 right-2 text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <div>{children}</div>
      </div>
    </div>
  );
}
