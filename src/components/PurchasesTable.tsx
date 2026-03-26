import React from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import type { PurchaseOrder } from '../types/purchaseOrder';
import { Eye, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from './common/Table';
import Button from './common/Button';

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

const PurchasesTable: React.FC<PurchasesTableProps> = ({ onReceive }) => {
  const { purchaseOrders, isLoading, isError, error } = usePurchaseOrders();
  const navigate = useNavigate();

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Proveedor', accessor: 'supplierName' },
    { header: 'Fecha de Orden', accessor: 'orderDate' },
    { header: 'Estado', accessor: 'status' },
    { header: 'Items', accessor: 'items' },
    { header: 'Fecha de Recepción', accessor: 'receivedDate' },
  ];

  const formattedData = purchaseOrders?.map(order => ({
    ...order,
    orderDate: new Date(order.orderDate).toLocaleDateString(),
    status: getStatusChip(order.status),
    items: order.items.length,
    receivedDate: order.receivedDate ? new Date(order.receivedDate).toLocaleDateString() : '-',
  }));

  const renderRowActions = (order: PurchaseOrder) => (
    <>
      <Button
        variant="info"
        size="sm"
        onClick={() => navigate(`/purchases/${order.id}`)}
        title="Ver Detalles"
        className="me-2"
      >
        <Eye size={16} />
      </Button>
      {order.status === 'PENDING' && (
        <Button
          variant="success"
          size="sm"
          onClick={() => onReceive(order)}
          title="Recibir Orden"
        >
          <Package size={16} />
        </Button>
      )}
    </>
  );

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
    <Table 
      columns={columns} 
      data={formattedData || []} 
      renderRowActions={renderRowActions} 
    />
  );
};

export default PurchasesTable;
