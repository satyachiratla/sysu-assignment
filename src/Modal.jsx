import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import { FaCopy } from "react-icons/fa";

export default function Modal({ open, onClose, category }) {
  const copyToClipboard = () => {
    const textToCopy = `sysu.vercel.com/${category?.toLowerCase()}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success("Link copied to clipboard"))
      .catch((error) => toast.error(error));
  };

  if (!open) return null;
  return createPortal(
    <>
      <div className="modal-overlay" />
      <div className="modal">
        <button type="button" className="close-button" onClick={onClose}>
          Close
        </button>
        <div className="modal-content">
          {`sysu.vercel.com/${category?.toLowerCase()}`}
          <span>
            <FaCopy size={25} onClick={copyToClipboard} />
          </span>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
}
