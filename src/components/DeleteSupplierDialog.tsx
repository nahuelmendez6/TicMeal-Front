import React from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import type { Supplier } from '../types/supplier';

interface DeleteSupplierDialogProps {
  supplier: Supplier;
  onClose: () => void;
}

const DeleteSupplierDialog: React.FC<DeleteSupplierDialogProps> = ({ supplier, onClose }) => {
  const { deleteSupplier, isDeleting } = useSuppliers();

  const handleDelete = async () => {
    try {
      await deleteSupplier(supplier.id);
      onClose();
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
      // Opcional: Mostrar una notificación de error
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar Proveedor</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que quieres eliminar a <strong>{supplier.name}</strong>?</p>
            <p className="text-danger">Esta acción no se puede deshacer.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSupplierDialog;