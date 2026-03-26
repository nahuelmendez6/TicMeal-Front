import React from "react";
import {
  Plus, Coffee, Sandwich, Apple, Pizza, Trash2, FilePenLine, Beef, Hamburger,
  IceCreamBowl, Salad, Soup, Utensils, Wine, Banana, Cookie, Croissant, Dessert,
  Drumstick, EggFried, Ham, IceCreamCone, CupSoda, CakeSlice, Beer, Torus, Donut,
  Egg, GlassWater, Milk
} from "lucide-react";
import type { LucideProps, LucideIcon } from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

// Mapeo directo de iconos Lucide
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

interface IconComponentProps extends LucideProps {
  iconName: IconName | null;
}

const IconComponent: React.FC<IconComponentProps> = React.memo(
  ({ iconName, size = 18, className = "mr-2 text-gray-600", color, ...rest }) => {
    const Icon = iconName ? iconMap[iconName] ?? iconMap.default : iconMap.default;
    return <Icon size={size} className={className} color={color} {...rest} />;
  }
);

// ----------------------------------------------------------------------
// FORM COMPONENT
// ----------------------------------------------------------------------

interface Props {
  editingItem: any | null;
  categories: any[];
  onSubmit: (formData: any, recipeIngredients: any[]) => void;
  recipeIngredients: any[];
  newItemState?: any;
  setNewItemState?: any;
  onCancel: () => void; // Added onCancel prop
}

const ItemForm: React.FC<Props> = ({
  editingItem,
  categories,
  onSubmit,
  recipeIngredients,
  newItemState,
  setNewItemState,
  onCancel, // Destructure onCancel
}) => {
  const newItem = newItemState!;
  const setNewItem = setNewItemState!;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isNumericField = ['minStock', 'maxOrder'].includes(name);

    setNewItem((prev: any) => ({
      ...prev,
      [name]: isNumericField ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newItem, recipeIngredients);
  };

  return (
    <form onSubmit={submit} id="item-form">
      <div className="row g-3">

        {/* IZQUIERDA */}
        <div className="col-md-6">
          <Input
            label="Nombre"
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleChange}
            required
          />

          <div className="row">
            <div className="col-sm-6">
              <Input
                label="Stock Mínimo"
                type="number"
                name="minStock"
                value={newItem.minStock}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-6">
              <Input
                label="Max. Orden"
                type="number"
                name="maxOrder"
                value={newItem.maxOrder}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div className="col-md-6">
          <Select
            label="Categoría"
            name="categoryId"
            value={newItem.categoryId}
            onChange={handleChange}
          >
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <div className="row">
            <div className="col-sm-12">
              <label className="form-label">Ícono</label>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <IconComponent iconName={newItem.iconName} />
                </span>

                <select
                  name="iconName"
                  className="form-select"
                  value={newItem.iconName}
                  onChange={handleChange}
                >
                  {Object.keys(iconMapList).map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" className="me-2" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {editingItem ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
