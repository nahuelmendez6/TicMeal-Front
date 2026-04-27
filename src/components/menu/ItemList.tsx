import React from "react";
import { PackagePlus, FilePenLine, Trash2 } from 'lucide-react';
import type { MenuItem as MenuItemType } from '../../types/menu';
import Table from '../common/Table';
import Button from '../common/Button';
import IconComponent from '../../utilities/icons.utility';

// ----------------------------------------------------------------------
// LIST COMPONENT
// ----------------------------------------------------------------------

interface Props {
  items: MenuItemType[];
  selectedCategory: string | null;
  onEdit: (item: MenuItemType) => void;
  onDelete: (id: number) => void;
  onManageStock: (item: MenuItemType) => void;
  itemType?: 'SIMPLE' | 'COMPUESTO'; // Add itemType prop
}

const ItemList: React.FC<Props> = ({ items, onEdit, onDelete, onManageStock, itemType }) => {
  const columns = [
    { header: 'Nombre', accessor: 'name' },
    ...(itemType !== 'COMPUESTO' ? [
      { header: 'Stock Actual', accessor: 'quantityInStock' },
      { header: 'Mínimo', accessor: 'minStock' },
      { header: 'Max Orden', 'accessor': 'maxOrder' },
    ] : []),
  ];

  const renderRowActions = (item: any) => ( // Change type to any as it's a formatted item
    <div className="d-flex align-items-center">
      {item.type === 'SIMPLE' && (
        <Button
          variant="success"
          size="sm"
          onClick={() => onManageStock(item.originalItem)} // Use originalItem
          title="Gestionar Stock"
          className="me-2 d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <PackagePlus size={18} />
        </Button>
      )}
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEdit(item.originalItem)} // Use originalItem
        title="Editar"
        className="me-2 d-flex align-items-center justify-content-center"
        style={{ width: '32px', height: '32px', padding: 0 }}
      >
        <FilePenLine size={18} />
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(item.id)}
        title="Eliminar"
        className="d-flex align-items-center justify-content-center"
        style={{ width: '32px', height: '32px', padding: 0 }}
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );

  const formattedItems = items.map(item => ({
    originalItem: item, // Store the original item here
    ...item,
    name: (
      <div className="d-flex align-items-center">
        <IconComponent iconName={item.iconName} size={24} /> {/* Increased size */}
        <span className="ms-2">{item.name}</span>
      </div>
    ),
    quantityInStock: item.quantityInStock ?? "—",
    minStock: item.minStock || "—",
    maxOrder: item.maxOrder || "—",
  }));

  return (
    <Table
      columns={columns}
      data={formattedItems}
      renderRowActions={renderRowActions}
    />
  );
};

export default ItemList;
