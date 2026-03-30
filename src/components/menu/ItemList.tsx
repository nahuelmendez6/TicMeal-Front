import React from "react";
import type { MenuItem as MenuItemType } from '../../types/menu';
import Table from '../common/Table';
import Button from '../common/Button';
import IconComponent from '../../utilities/icons.utility'; // Corrected import path

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
    <>
      {item.type === 'SIMPLE' && (
        <Button
          variant="success"
          size="sm"
          onClick={() => onManageStock(item.originalItem)} // Use originalItem
          title="Gestionar Stock"
          className="me-2"
        >
          <IconComponent iconName="PackagePlus" size={24} /> {/* Increased size */}
        </Button>
      )}
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEdit(item.originalItem)} // Use originalItem
        className="me-2"
      >
        <IconComponent iconName="FilePenLine" size={24} /> {/* Increased size */}
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(item.id)}
      >
        <IconComponent iconName="Trash2" size={24} /> {/* Increased size */}
      </Button>
    </>
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
