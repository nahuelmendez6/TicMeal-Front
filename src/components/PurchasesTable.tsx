import React from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import type { PurchaseOrder } from '../types/purchaseOrder';
import { Eye, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente Skeleton para la tabla
const TableSkeleton = () => (
  <div className="w-100">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="d-flex justify-content-between p-3 border-bottom">
        <div className="placeholder-glow w-100">
          <span className="placeholder col-1 me-3"></span> {/* ID */}
          <span className="placeholder col-2 me-3"></span> {/* Proveedor */}
          <span className="placeholder col-2 me-3"></span> {/* Fecha Orden */}
          <span className="placeholder col-1 me-3"></span> {/* Estado */}
          <span className="placeholder col-1 me-3"></span> {/* Items */}
          <span className="placeholder col-2 me-3"></span> {/* Fecha Recepción */}
          <span className="placeholder col-1"></span> {/* Acciones */}
        </div>
      </div>
    ))}
  </div>
);

interface PurchasesTableProps {
  onReceive: (order: PurchaseOrder) => void;
}

const PurchasesTable: React.FC<PurchasesTableProps> = ({ onReceive }) => {
  const { purchaseOrders, isLoading, isError, error } = usePurchaseOrders();
  const navigate = useNavigate();

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

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="alert alert-danger">
        Error al cargar las órdenes de compra: {error?.message || 'Error desconocido'}
      </div>
    );
  }

  if (!purchaseOrders || purchaseOrders.length === 0) {
    return <p>No se encontraron órdenes de compra.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Fecha de Orden</th>
            <th>Estado</th>
            <th>Items</th>
            <th>Fecha de Recepción</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.supplierName}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{getStatusChip(order.status)}</td>
              <td>{order.items.length}</td>
              <td>{order.receivedDate ? new Date(order.receivedDate).toLocaleDateString() : '-'}</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => navigate(`/purchases/${order.id}`)}
                  title="Ver Detalles"
                >
                  <Eye size={16} />
                </button>
                {order.status === 'PENDING' && (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => onReceive(order)}
                    title="Recibir Orden"
                  >
                    <Package size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasesTable;
