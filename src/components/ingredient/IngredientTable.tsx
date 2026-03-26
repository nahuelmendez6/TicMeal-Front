// src/components/ingredient/IngredientTable.tsx
import React from 'react';
import { FilePenLine, Trash2, PackagePlus } from 'lucide-react';
import type { Ingredient } from '../../types/ingtredient';
import Table from '../common/Table';
import Button from '../common/Button';

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
  onManageStock: (ingredient: Ingredient) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ ingredients, onEdit, onDelete, onManageStock }) => {
  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Unidad', accessor: 'unit' },
    { header: 'Stock Actual', accessor: 'quantityInStock' },
    { header: 'Stock Mínimo', accessor: 'minStock' },
    { header: 'Merma (%)', accessor: 'shrinkagePercentage' },
  ];

  const renderRowActions = (ingredient: Ingredient) => (
    <>
      <Button
        variant="success"
        size="sm"
        onClick={() => onManageStock(ingredient)}
        title="Gestionar Stock"
        className="me-2"
      >
        <PackagePlus size={18} />
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEdit(ingredient)}
        title="Editar Ingrediente"
        className="me-2"
      >
        <FilePenLine size={18} />
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(ingredient.id)}
        title="Eliminar Ingrediente"
      >
        <Trash2 size={18} />
      </Button>
    </>
  );

  const data = ingredients.map(i => ({
    ...i,
    quantityInStock: i.quantityInStock ?? 0,
    minStock: i.minStock ?? 'N/A',
    shrinkagePercentage: `${i.shrinkagePercentage ?? 0}%`,
  }));

  return (
    <Table
      columns={columns}
      data={data}
      renderRowActions={renderRowActions}
    />
  );
};

export default IngredientTable;