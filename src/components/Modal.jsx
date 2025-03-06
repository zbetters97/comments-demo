import ReactDOM from "react-dom";

export default function Modal(props) {

  const { children, handleCloseModal } = props;

  return ReactDOM.createPortal(
    <div className="modal-container">
      <button onClick={handleCloseModal}>Close</button>

      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById("portal")
  );
}