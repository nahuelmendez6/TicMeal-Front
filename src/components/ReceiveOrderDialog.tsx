import React from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import type { PurchaseOrder } from '../types/purchaseOrder';

interface ReceiveOrderDialogProps {
  order: PurchaseOrder;
  onClose: () => void;
}

const ReceiveOrderDialog: React.FC<ReceiveOrderDialogProps> = ({ order, onClose }) => {
  const { receivePurchaseOrder, isReceiving } = usePurchaseOrders();

  const handleReceive = async () => {
    try {
      await receivePurchaseOrder(order.id);
      onClose();
    } catch (error) {
      console.error('Error al recibir la orden:', error);
      // Opcional: Mostrar una notificación de error
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Recibir Orden de Compra</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>¿Confirmas la recepción de todos los productos de la orden <strong>#{order.id}</strong> del proveedor <strong>{order.supplierName}</strong>?</p>
            <p className="text-danger">Esta acción modificará el stock y no se puede deshacer.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isReceiving}>
              Cancelar
            </button>
            <button type="button" className="btn btn-success" onClick={handleReceive} disabled={isReceiving}>
              {isReceiving ? 'Recibiendo...' : 'Confirmar Recepción'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveOrderDialog;
