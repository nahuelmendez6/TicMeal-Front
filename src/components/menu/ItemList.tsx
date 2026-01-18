import React from "react";
import {
  Plus, Coffee, Sandwich, Apple, Pizza, Trash2, FilePenLine, Beef, Hamburger,
  IceCreamBowl, Salad, Soup, Utensils, Wine, Banana, Cookie, Croissant, Dessert,
  Drumstick, EggFried, Ham, IceCreamCone, CupSoda, CakeSlice, Beer, Torus, Donut,
  Egg, GlassWater, Milk, PackagePlus
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MenuItem as MenuItemType } from '../../types/menu';

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
  return (
    <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Nombre</th>
            {itemType !== 'COMPUESTO' && (
              <>
                <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Stock Actual</th>
                <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Mínimo</th>
                <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Max Orden</th>
              </>
            )}
            <th style={{ position: 'sticky', top: 0, zIndex: 1, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <div className="d-flex align-items-center">
                  <IconComponent iconName={item.iconName as IconName} size={18} />
                  <span className="ms-2">{item.name}</span>
                </div>
              </td>
              {itemType !== 'COMPUESTO' && (
                <>
                  <td>{item.quantityInStock ?? "—"}</td>
                  <td>{item.minStock || "—"}</td>
                  <td>{item.maxOrder || "—"}</td>
                </>
              )}
              <td className="text-end">
                {item.type === 'SIMPLE' && (
                  <button
                    className="btn btn-sm btn-outline-success me-2"
                    onClick={() => onManageStock(item)}
                    title="Gestionar Stock"
                  >
                    <PackagePlus size={18} />
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEdit(item)}
                >
                  <FilePenLine size={18} />
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(item.id)}
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

export default ItemList;
