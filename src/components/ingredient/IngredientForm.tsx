// src/components/ingredient/IngredientForm.tsx
import React, { useState, useEffect } from 'react';
import type { Ingredient } from '../../types/ingtredient';
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

  useEffect(() => {
    if (editingIngredient) {
      setName(editingIngredient.name);
      setUnit(editingIngredient.unit);
      setMinStock(editingIngredient.minStock ?? '');
      setShrinkagePercentage(editingIngredient.shrinkagePercentage ?? '');
    } else {
      setName('');
      setUnit('KILOGRAM');
      setMinStock('');
      setShrinkagePercentage('');
    }
  }, [editingIngredient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      unit,
      minStock: Number(minStock),
      shrinkagePercentage: Number(shrinkagePercentage),
      companyId: null, // Assuming companyId is handled by the backend
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