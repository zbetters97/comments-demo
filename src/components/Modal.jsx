export default function Modal({ open, onClose, children }) {

  return (
    <div
      className={`fixed inset-0 transition-colors ${open ? "visible bg-black/80" : "invisible"}`}
    >
      <div
        className={`bg-white rounded-sm p-6 fixed top-1/2 left-1/2 -translate-1/2 -translate-1/2 transition-all 
        ${open ? "scale-100 opacity-100 " : "scale-50 opacity-0"}`}>
        <button
          className="font-bold text-3xl absolute top-0 right-2"
          onClick={onClose}
        >
          &times;
        </button>

        <div>
          {children}
        </div>
      </div>
    </ div >
  );
}