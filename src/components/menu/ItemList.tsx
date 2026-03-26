import React from "react";
import {
  Plus, Coffee, Sandwich, Apple, Pizza, Trash2, FilePenLine, Beef, Hamburger,
  IceCreamBowl, Salad, Soup, Utensils, Wine, Banana, Cookie, Croissant, Dessert,
  Drumstick, EggFried, Ham, IceCreamCone, CupSoda, CakeSlice, Beer, Torus, Donut,
  Egg, GlassWater, Milk, PackagePlus
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MenuItem as MenuItemType } from '../../types/menu';
import Table from '../common/Table';
import Button from '../common/Button';

// ----------------------------------------------------------------------
// ICON MAP DIRECTO
// ----------------------------------------------------------------------

const iconMapList = {
  Plus, Coffee, Sandwich, Apple, Pizza, Trash2, FilePenLine, Beef, Hamburger,
  IceCreamBowl, Salad, Soup, Utensils, Wine, Banana, Cookie, Croissant, Dessert,
  Drumstick, EggFried, Ham, IceCreamCone, CupSoda, CakeSlice, Beer, Torus, Donut,
  Egg, GlassWater, Milk,
};

export type IconName = keyof typeof iconMapList;

const iconMap: { [key in IconName | "default"]: LucideIcon } = {
  ...iconMapList,
  default: Utensils,
};

interface IconComponentProps {
  iconName: IconName | null;
  size?: number;
}

const IconComponent: React.FC<IconComponentProps> = ({ iconName, size = 20 }) => {
  const Icon = iconName ? iconMap[iconName] ?? iconMap.default : iconMap.default;
  return <Icon size={size} />;
};

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
      { header: 'Max Orden', accessor: 'maxOrder' },
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
          <PackagePlus size={18} />
        </Button>
      )}
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEdit(item.originalItem)} // Use originalItem
        className="me-2"
      >
        <FilePenLine size={18} />
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 size={18} />
      </Button>
    </>
  );

  const formattedItems = items.map(item => ({
    originalItem: item, // Store the original item here
    ...item,
    name: (
      <div className="d-flex align-items-center">
        <IconComponent iconName={item.iconName as IconName} size={18} />
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
