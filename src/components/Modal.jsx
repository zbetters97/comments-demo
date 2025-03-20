export default function Modal({ isModalOpen, onClose, children }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-colors ${isModalOpen ? "visible bg-black/80" : "invisible"}`}
      onClick={onClose}
    >
      <div
        className={`fixed top-1/2 left-1/2 -translate-1/2 rounded-sm bg-white p-6 transition-all ${isModalOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
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
