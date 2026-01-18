// src/components/ConfirmationModal.tsx
import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirming?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  isConfirming = false,
}) => {
  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel} disabled={isConfirming}></button>
          </div>
          <div className="modal-body">
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isConfirming}>
              {cancelButtonText}
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {confirmButtonText}...
                </>
              ) : (
                confirmButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
