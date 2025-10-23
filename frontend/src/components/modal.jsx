import React from "react";

function Modal({title, children, onClose, primaryAction, primaryLabel="Confirmar", secondaryLabel="Cancelar"}) {
  return (
    <>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="gold bold sans-serif">{title}</div>
          <button onClick={onClose} className="close bold" aria-label="Fechar modal">
            &times;
          </button>
        </div>

        <div className="modal-text justify">
          {children}

          <div className="modal-buttons">
            <button onClick={primaryAction} className="bold">
              {primaryLabel}
            </button>
            <button onClick={onClose} className="bold">
              {secondaryLabel}
            </button>
          </div>
        </div>
      </div>
      <div id="overlay" onClick={onClose}></div>
    </>
  );
}

export default Modal;