// src/components/inventory/InventoryAuditTable.tsx
import React from 'react';
import type { AuditableItem, AuditType } from '../../types/inventory';

interface InventoryAuditTableProps {
  items: AuditableItem[];
  auditType: AuditType;
  onPhysicalStockChange: (itemId: number, value: string) => void;
}

const InventoryAuditTable: React.FC<InventoryAuditTableProps> = ({ items, auditType, onPhysicalStockChange }) => {
  const isIngredient = auditType === 'ingredient';

  return (
    <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Nombre</th>
            {isIngredient && <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Unidad</th>}
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Teórico</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Físico</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Diferencia</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Impacto Económico</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              {isIngredient && <td>{'unit' in item ? item.unit : ''}</td>}
              <td>{item.quantityInStock ?? 0}</td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={item.physicalStock}
                  onChange={(e) => onPhysicalStockChange(item.id, e.target.value)}
                  min="0"
                />
              </td>
              <td className={item.difference < 0 ? 'text-danger' : (item.difference > 0 ? 'text-success' : '')}>
                {item.difference.toFixed(2)}
              </td>
              <td className={item.financialImpact < 0 ? 'text-danger' : (item.financialImpact > 0 ? 'text-success' : '')}>
                ${item.financialImpact.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryAuditTable;