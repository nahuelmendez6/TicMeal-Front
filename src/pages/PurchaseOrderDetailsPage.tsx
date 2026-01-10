import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import ReceiveOrderDialog from '../components/ReceiveOrderDialog'; // Assuming this is the correct path
import type { PurchaseOrder } from '../types/purchaseOrder';
import { Package } from 'lucide-react';

const PurchaseOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();

  const { getPurchaseOrderQuery, isReceiving } = usePurchaseOrders();
  const { data: purchaseOrder, isLoading, isError, error } = getPurchaseOrderQuery(orderId);

  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);

  const handleReceiveClick = () => {
    setIsReceiveDialogOpen(true);
  };

  const handleCloseReceiveDialog = () => {
    setIsReceiveDialogOpen(false);
  };

  if (isLoading) {
    return <div className="container-fluid mt-4">Cargando detalles de la orden...</div>;
  }

  if (isError) {
    return (
      <div className="container-fluid mt-4 alert alert-danger">
        Error al cargar la orden de compra: {error?.message || 'Error desconocido'}
      </div>
    );
  }

  if (!purchaseOrder) {
    return <div className="container-fluid mt-4 alert alert-warning">Orden de compra no encontrada.</div>;
  }

  const getStatusChip = (status: PurchaseOrder['status']) => {
    let colorClass = '';
    switch (status) {
      case 'PENDING':
        colorClass = 'bg-warning text-dark';
        break;
      case 'COMPLETED':
        colorClass = 'bg-success';
        break;
      case 'CANCELLED':
        colorClass = 'bg-danger';
        break;
      default:
        colorClass = 'bg-secondary';
    }
    return <span className={`badge ${colorClass}`}>{status}</span>;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Detalles de Orden de Compra #{purchaseOrder.id}</h1>
        <div>
          {purchaseOrder.status === 'PENDING' && (
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={handleReceiveClick}
              disabled={isReceiving}
            >
              <Package size={20} className="me-2" />
              Recibir Orden
            </button>
          )}
          <button className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Información General</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <strong>ID de Orden:</strong> {purchaseOrder.id}
            </div>
            <div className="col-md-6 mb-3">
              <strong>Estado:</strong> {getStatusChip(purchaseOrder.status)}
            </div>
            <div className="col-md-6 mb-3">
              <strong>Proveedor:</strong> {purchaseOrder.supplierName} (ID: {purchaseOrder.supplierId})
            </div>
            <div className="col-md-6 mb-3">
              <strong>Fecha de Orden:</strong> {new Date(purchaseOrder.orderDate).toLocaleDateString()}
            </div>
            <div className="col-md-6 mb-3">
              <strong>Fecha de Recepción:</strong> {purchaseOrder.receivedDate ? new Date(purchaseOrder.receivedDate).toLocaleDateString() : 'Pendiente'}
            </div>
            <div className="col-md-6 mb-3">
              <strong>Total:</strong> ${purchaseOrder.totalAmount ? purchaseOrder.totalAmount.toFixed(2) : '0.00'}
            </div>
            <div className="col-12 mb-3">
              <strong>Notas:</strong> {purchaseOrder.notes || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Items de la Orden</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Costo Unitario</th>
                  <th>Lote</th>
                  <th>Fecha de Vencimiento</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.productType === 'INGREDIENT' ? 'Ingrediente' : 'Producto de Menú'}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitCost.toFixed(2)}</td>
                    <td>{item.lot || '-'}</td>
                    <td>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : '-'}</td>
                    <td>${(item.quantity * item.unitCost).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isReceiveDialogOpen && purchaseOrder && (
        <ReceiveOrderDialog
          order={purchaseOrder}
          onClose={handleCloseReceiveDialog}
        />
      )}
    </div>
  );
};

export default PurchaseOrderDetailsPage;
