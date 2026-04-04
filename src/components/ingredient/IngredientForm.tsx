// src/components/ingredient/IngredientForm.tsx
import React, { useState, useEffect } from 'react';
import type { Ingredient } from '../../types/ingtredient';
import type { NutritionalInfo } from '../../types/nutritionalInfo';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface IngredientFormProps {
  editingIngredient: Ingredient | null;
  onSave: (ingredient: Omit<Ingredient, 'id' | 'quantityInStock' | 'lots'>) => void;
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ editingIngredient, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('KILOGRAM');
  const [minStock, setMinStock] = useState<number | ''>('');
  const [shrinkagePercentage, setShrinkagePercentage] = useState<number | ''>('');
  const [isFresh, setIsFresh] = useState<boolean>(false);

  // Nutritional Info States
  const [calories, setCalories] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [carbohydrates, setCarbohydrates] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [sugar, setSugar] = useState<number | ''>('');
  const [sodium, setSodium] = useState<number | ''>('');

  useEffect(() => {
    if (editingIngredient) {
      setName(editingIngredient.name);
      setUnit(editingIngredient.unit);
      setMinStock(editingIngredient.minStock ?? '');
      setShrinkagePercentage(editingIngredient.shrinkagePercentage ?? '');
      setIsFresh(editingIngredient.isFresh ?? false);

      // Initialize Nutritional Info
      setCalories(editingIngredient.nutritionalInfo?.calories ?? '');
      setProtein(editingIngredient.nutritionalInfo?.protein ?? '');
      setCarbohydrates(editingIngredient.nutritionalInfo?.carbohydrates ?? '');
      setFat(editingIngredient.nutritionalInfo?.fat ?? '');
      setSugar(editingIngredient.nutritionalInfo?.sugar ?? '');
      setSodium(editingIngredient.nutritionalInfo?.sodium ?? '');
    } else {
      setName('');
      setUnit('KILOGRAM');
      setMinStock('');
      setShrinkagePercentage('');
      setIsFresh(false);

      // Reset Nutritional Info
      setCalories('');
      setProtein('');
      setCarbohydrates('');
      setFat('');
      setSugar('');
      setSodium('');
    }
  }, [editingIngredient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nutritionalInfo: NutritionalInfo = {
      calories: Number(calories),
      protein: Number(protein),
      carbohydrates: Number(carbohydrates),
      fat: Number(fat),
      sugar: sugar === '' ? undefined : Number(sugar),
      sodium: sodium === '' ? undefined : Number(sodium),
    };

    onSave({
      name,
      unit,
      minStock: Number(minStock),
      shrinkagePercentage: Number(shrinkagePercentage),
      companyId: null,
      isFresh,
      nutritionalInfo,
    });
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editingIngredient ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <Input
                label="Nombre"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Select
                label="Unidad"
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              >
                <option value="KILOGRAM">Kilogramo</option>
                <option value="LITER">Litro</option>
                <option value="UNIT">Unidad</option>
              </Select>
              <Input
                label="Stock Mínimo"
                type="number"
                id="minStock"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Merma (%)"
                type="number"
                id="shrinkagePercentage"
                value={shrinkagePercentage}
                onChange={(e) => setShrinkagePercentage(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej: 20"
              />
              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isFresh"
                  checked={isFresh}
                  onChange={(e) => setIsFresh(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isFresh">
                  Es Ingrediente Fresco (JIT)
                </label>
              </div>

              <h6 className="mt-4 mb-3">Información Nutricional (por 100g o unidad base)</h6>
              <Input
                label="Calorías"
                type="number"
                id="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Proteínas (g)"
                type="number"
                id="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Carbohidratos (g)"
                type="number"
                id="carbohydrates"
                value={carbohydrates}
                onChange={(e) => setCarbohydrates(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Grasas (g)"
                type="number"
                id="fat"
                value={fat}
                onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Azúcar (g) (Opcional)"
                type="number"
                id="sugar"
                value={sugar}
                onChange={(e) => setSugar(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <Input
                label="Sodio (mg) (Opcional)"
                type="number"
                id="sodium"
                value={sodium}
                onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
              <Button type="submit" variant="primary">Guardar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IngredientForm;