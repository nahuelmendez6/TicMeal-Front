import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import IconComponent from "../../utilities/icons.utility";
import type { NutritionalInfo } from "../../types/nutritionalInfo";
import type { Observation } from "../../types/observation";
import { getObservations } from "../../services/observation.service";
import IconPicker from "./IconPicker";
import Button from "../common/Button";

// ----------------------------------------------------------------------
// FORM COMPONENT
// ----------------------------------------------------------------------

interface Props {
  editingItem: any | null;
  categories: any[];
  onSubmit: (formData: any, recipeIngredients: any[], nutritionalInfo: NutritionalInfo, observationIds: number[]) => void;
  recipeIngredients: any[];
  newItemState?: any;
  setNewItemState?: any;
  nutritionalInfoState: [NutritionalInfo, React.Dispatch<React.SetStateAction<NutritionalInfo>>];
  onCancel: () => void;
  renderRecipeEditor?: () => React.ReactNode;
}

const ItemForm: React.FC<Props> = ({
  editingItem,
  categories,
  onSubmit,
  recipeIngredients,
  newItemState,
  setNewItemState,
  nutritionalInfoState,
  onCancel,
  renderRecipeEditor,
}) => {
  const newItem = newItemState!;
  const setNewItem = setNewItemState!;
  const [nutritionalInfo, setNutritionalInfo] = nutritionalInfoState;

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [availableObservations, setAvailableObservations] = useState<Observation[]>([]);
  const [selectedObservationIds, setSelectedObservationIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const obs = await getObservations();
        setAvailableObservations(obs);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };
    fetchObservations();
  }, []);

  useEffect(() => {
    if (editingItem?.observations) {
      setSelectedObservationIds(editingItem.observations.map((o: any) => o.id));
    } else {
      setSelectedObservationIds([]);
    }
  }, [editingItem]);

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
    onSubmit(
      newItem,
      recipeIngredients,
      newItem.type === 'SIMPLE' ? nutritionalInfo : undefined as any,
      selectedObservationIds
    );
  };

  const handleNutritionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutritionalInfo((prev: NutritionalInfo) => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value),
    }));
  };

  const handleObservationToggle = (id: number) => {
    setSelectedObservationIds(prev =>
      prev.includes(id) ? prev.filter(obsId => obsId !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={submit} id="item-form">
      <div className="row g-3">
        {/* IZQUIERDA: General Info & Observations */}
        <div className="col-md-6 border-end">
          <h6 className="mb-3">Información General</h6>
          <Input
            label="Nombre"
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleChange}
            required
          />

          <div className="row g-2">
            <div className="col-sm-6">
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
            </div>
            <div className="col-sm-6">
              <label className="form-label">Ícono</label>
              <div className="d-flex align-items-center">
                <div
                  className="p-1 border rounded d-flex align-items-center justify-content-center me-2 bg-light"
                  style={{ width: '40px', height: '40px' }}
                >
                  <IconComponent iconName={newItem.iconName} size={24} />
                </div>
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setIsIconPickerOpen(true)}
                >
                  Cambiar
                </Button>
              </div>
            </div>
          </div>

          <div className="row g-2">
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

          <h6 className="mt-4 mb-2">Observaciones / Alérgenos</h6>
          <div className="border rounded p-2 bg-light" style={{ height: '160px', overflowY: 'auto' }}>
            <div className="row g-1">
              {availableObservations.map((obs) => (
                <div key={obs.id} className="col-6">
                  <div className={`p-1 border rounded d-flex align-items-center mb-1 ${selectedObservationIds.includes(obs.id) ? 'bg-white border-primary' : 'bg-transparent'}`} 
                       style={{ cursor: 'pointer' }}
                       onClick={() => handleObservationToggle(obs.id)}>
                    <input
                      className="form-check-input me-2 mt-0"
                      type="checkbox"
                      checked={selectedObservationIds.includes(obs.id)}
                      readOnly
                    />
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="me-1" style={{ fontSize: '0.8rem' }}>🖼️</span>
                      <span className="text-truncate" style={{ fontSize: '0.75rem' }} title={obs.name}>{obs.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DERECHA: Nutritional Info & Recipe */}
        <div className="col-md-6">
          {newItem.type === 'SIMPLE' ? (
            <>
              <h6 className="mb-3">Información Nutricional (por 100g/u)</h6>
              <div className="row g-2">
                <div className="col-6">
                  <Input
                    label="Calorías"
                    type="number"
                    name="calories"
                    value={nutritionalInfo.calories ?? ''}
                    onChange={handleNutritionalChange}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label="Proteínas (g)"
                    type="number"
                    name="protein"
                    value={nutritionalInfo.protein ?? ''}
                    onChange={handleNutritionalChange}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label="Carbo (g)"
                    type="number"
                    name="carbohydrates"
                    value={nutritionalInfo.carbohydrates ?? ''}
                    onChange={handleNutritionalChange}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label="Grasas (g)"
                    type="number"
                    name="fat"
                    value={nutritionalInfo.fat ?? ''}
                    onChange={handleNutritionalChange}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label="Azúcar (g)"
                    type="number"
                    name="sugar"
                    value={nutritionalInfo.sugar ?? ''}
                    onChange={handleNutritionalChange}
                  />
                </div>
                <div className="col-6">
                  <Input
                    label="Sodio (mg)"
                    type="number"
                    name="sodium"
                    value={nutritionalInfo.sodium ?? ''}
                    onChange={handleNutritionalChange}
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-light rounded text-muted small">
                <p className="mb-0">Los valores ingresados se utilizarán para el cálculo automático de costos y valores nutricionales.</p>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column">
              <h6 className="mb-3">Receta</h6>
              <div className="flex-grow-1 overflow-auto border rounded p-2 bg-light">
                {renderRecipeEditor && renderRecipeEditor()}
              </div>
            </div>
          )}
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
