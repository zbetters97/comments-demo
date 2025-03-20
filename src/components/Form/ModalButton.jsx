import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Modal from "./Modal";
import Authentication from "./Authentication";

export default function ModalButton() {
  const { globalUser, globalData, logout } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Authentication onClose={() => setIsModalOpen(false)} />
      </Modal>

      {globalData && globalUser ? (
        <button
          className="rounded-sm bg-gray-300 px-3 py-1"
          onClick={() => logout()}
        >
          Logout
        </button>
      ) : (
        <button
          className="rounded-sm bg-gray-300 px-3 py-1"
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          onClick={() => setIsModalOpen(true)}
        >
          Login
        </button>
      )}
    </div>
  );
}
