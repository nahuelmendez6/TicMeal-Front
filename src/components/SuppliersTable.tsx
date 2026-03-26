import React from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import type { Supplier } from '../types/supplier';
import { Edit, Trash2 } from 'lucide-react';
import Table from './common/Table';
import Button from './common/Button';

// Componente Skeleton para la tabla
const TableSkeleton = () => (
  <div className="w-100">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="d-flex justify-content-between p-3 border-bottom">
        <div className="placeholder-glow w-100">
          <span className="placeholder col-2 me-3"></span>
          <span className="placeholder col-2 me-3"></span>
          <span className="placeholder col-2 me-3"></span>
          <span className="placeholder col-3 me-3"></span>
          <span className="placeholder col-1"></span>
        </div>
      </div>
    ))}
  </div>
);


interface SuppliersTableProps {
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ onEdit, onDelete }) => {
  const { suppliers, isLoading, isError, error } = useSuppliers();

  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Nombre de Contacto', accessor: 'contactName' },
    { header: 'Teléfono', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
  ];

  const renderRowActions = (supplier: Supplier) => (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onEdit(supplier)}
        title="Editar"
        className="me-2"
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(supplier)}
        title="Eliminar"
      >
        <Trash2 size={16} />
      </Button>
    </>
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="alert alert-danger">
        Error al cargar los proveedores: {error?.message || 'Error desconocido'}
      </div>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return <p>No se encontraron proveedores.</p>;
  }

  return (
    <Table 
      columns={columns} 
      data={suppliers} 
      renderRowActions={renderRowActions} 
    />
  );
};

export default SuppliersTable;