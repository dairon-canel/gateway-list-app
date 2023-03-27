import { FC, ReactElement } from 'react';

interface IModalProps {
  children: string | JSX.Element | JSX.Element[];
  modalKey: string;
  onClose: () => void;
}

const Modal: FC<IModalProps> = ({ children, modalKey, onClose }) => {
  const checkbox = document.querySelector(`#${modalKey}`) as HTMLInputElement;

  return (
    <>
      <input
        type="checkbox"
        id={modalKey}
        className="modal-toggle"
        onChange={() => {
          if (checkbox?.checked === false) return onClose();
        }}
      />
      <label
        htmlFor={modalKey}
        className="modal cursor-pointer modal-bottom sm:modal-middle"
      >
        <label
          style={{ maxWidth: '50rem' }}
          className="modal-box w-full relative"
          htmlFor=""
        >
          {children}
        </label>
      </label>
    </>
  );
};

export default Modal;
