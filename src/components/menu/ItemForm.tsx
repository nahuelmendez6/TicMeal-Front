import React, { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import IconComponent from "../../utilities/icons.utility";
import type { IconName } from "../../utilities/icons.utility";
import IconPicker from "./IconPicker";
import Button from "../common/Button";

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

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

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
              <div className="d-flex align-items-center">
                <div
                  className="p-2 border rounded-sm d-flex align-items-center justify-content-center me-3"
                  style={{ width: '60px', height: '60px' }}
                >
                  <IconComponent iconName={newItem.iconName} size={32} />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsIconPickerOpen(true)}
                >
                  Cambiar Ícono
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <IconPicker
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelectIcon={(iconName) => {
          setNewItem((prev: any) => ({ ...prev, iconName }));
        }}
      />
    </form>
  );
};

export default ItemForm;
