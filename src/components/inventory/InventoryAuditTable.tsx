// src/components/inventory/InventoryAuditTable.tsx
import React from 'react';
import type { AuditIngredient } from '../../types/inventory';

interface InventoryAuditTableProps {
  ingredients: AuditIngredient[];
  onPhysicalStockChange: (ingredientId: number, value: string) => void;
}

const InventoryAuditTable: React.FC<InventoryAuditTableProps> = ({ ingredients, onPhysicalStockChange }) => {
  return (
    <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Nombre</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Unidad</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Teórico</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Físico</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Diferencia</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Impacto Económico</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map(ingredient => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{ingredient.unit}</td>
              <td>{ingredient.quantityInStock ?? 0}</td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={ingredient.physicalStock}
                  onChange={(e) => onPhysicalStockChange(ingredient.id, e.target.value)}
                  min="0"
                />
              </td>
              <td className={ingredient.difference < 0 ? 'text-danger' : (ingredient.difference > 0 ? 'text-success' : '')}>
                {ingredient.difference.toFixed(2)}
              </td>
              <td className={ingredient.financialImpact < 0 ? 'text-danger' : (ingredient.financialImpact > 0 ? 'text-success' : '')}>
                ${ingredient.financialImpact.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryAuditTable;
