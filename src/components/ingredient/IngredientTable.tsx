// src/components/ingredient/IngredientTable.tsx
import React from 'react';
import { FilePenLine, Trash2, PackagePlus } from 'lucide-react';
import type { Ingredient } from '../../types/ingtredient';

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
  onManageStock: (ingredient: Ingredient) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ ingredients, onEdit, onDelete, onManageStock }) => {
  return (
    <div className="table-responsive" style={{ maxHeight: '450px', overflowY: 'auto' }}>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Nombre</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Unidad</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Actual</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Mínimo</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Merma (%)</th>
            <th style={{ position: 'sticky', top: 0, zIndex: 1, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map(ingredient => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{ingredient.unit}</td>
              <td>{ingredient.quantityInStock ?? 0}</td>
              <td>{ingredient.minStock ?? 'N/A'}</td>
              <td>{ingredient.shrinkagePercentage ?? 0}%</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={() => onManageStock(ingredient)}
                  title="Gestionar Stock"
                >
                  <PackagePlus size={18} />
                </button>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEdit(ingredient)}
                  title="Editar Ingrediente"
                >
                  <FilePenLine size={18} />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(ingredient.id)}
                  title="Eliminar Ingrediente"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientTable;