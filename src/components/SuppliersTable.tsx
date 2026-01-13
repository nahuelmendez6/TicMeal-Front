import React from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import type { Supplier } from '../types/supplier';
import { Edit, Trash2 } from 'lucide-react';

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
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Nombre de Contacto</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contactName || '-'}</td>
              <td>{supplier.phone || '-'}</td>
              <td>{supplier.email || '-'}</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => onEdit(supplier)}
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(supplier)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuppliersTable;