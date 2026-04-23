// src/components/ingredient/IngredientForm.tsx
import React, { useState, useEffect } from 'react';
import type { Ingredient } from '../../types/ingtredient';
import type { NutritionalInfo } from '../../types/nutritionalInfo';
import type { Observation } from '../../types/observation';
import { getObservations } from '../../services/observation.service';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface IngredientFormProps {
  editingIngredient: Ingredient | null;
  onSave: (ingredient: any) => void; // Using any for simplicity in the DTO mapping here
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ editingIngredient, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
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

  // Observations State
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

      // Initialize Observations
      setSelectedObservationIds(editingIngredient.observations?.map(obs => obs.id) || []);
    } else {
      setName('');
      setUnit('kg');
      setMinStock('');
      setShrinkagePercentage('');
      setIsFresh(false);
      setCalories('');
      setProtein('');
      setCarbohydrates('');
      setFat('');
      setSugar('');
      setSodium('');
      setSelectedObservationIds([]);
    }
  }, [editingIngredient]);

  const handleObservationToggle = (id: number) => {
    setSelectedObservationIds(prev =>
      prev.includes(id) ? prev.filter(obsId => obsId !== id) : [...prev, id]
    );
  };

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
      observationIds: selectedObservationIds,
    });
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editingIngredient ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                {/* General Info Section */}
                <div className="col-md-6 border-end">
                  <h6 className="mb-3">Información General</h6>
                  <div className="mb-3">
                    <Input
                      label="Nombre"
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <Select
                        label="Unidad"
                        id="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        required
                      >
                        <option value="kg">Kg</option>
                        <option value="g">g</option>
                        <option value="l">L</option>
                        <option value="ml">ml</option>
                        <option value="unit">un</option>
                      </Select>
                    </div>
                    <div className="col-6">
                      <Input
                        label="Stock Mín"
                        type="number"
                        id="minStock"
                        value={minStock}
                        onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="row g-2 align-items-end">
                    <div className="col-6">
                      <Input
                        label="Merma (%)"
                        type="number"
                        id="shrinkagePercentage"
                        value={shrinkagePercentage}
                        onChange={(e) => setShrinkagePercentage(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isFresh"
                          checked={isFresh}
                          onChange={(e) => setIsFresh(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="isFresh">
                          Fresco (JIT)
                        </label>
                      </div>
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
                              <span className="me-1" style={{ fontSize: '0.8rem' }}>🖼️</span> {/* Placeholder for icon */}
                              <span className="text-truncate" style={{ fontSize: '0.75rem' }} title={obs.name}>{obs.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nutritional Info Section */}
                <div className="col-md-6">
                  <h6 className="mb-3">Información Nutricional (por 100g/u)</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <Input
                        label="Calorías"
                        type="number"
                        id="calories"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <Input
                        label="Proteínas (g)"
                        type="number"
                        id="protein"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <Input
                        label="Carbo (g)"
                        type="number"
                        id="carbohydrates"
                        value={carbohydrates}
                        onChange={(e) => setCarbohydrates(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <Input
                        label="Grasas (g)"
                        type="number"
                        id="fat"
                        value={fat}
                        onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <Input
                        label="Azúcar (g)"
                        type="number"
                        id="sugar"
                        value={sugar}
                        onChange={(e) => setSugar(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <Input
                        label="Sodio (mg)"
                        type="number"
                        id="sodium"
                        value={sodium}
                        onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-light rounded text-muted small">
                    <p className="mb-0">Los valores ingresados se utilizarán para el cálculo automático de costos y valores nutricionales de las recetas.</p>
                  </div>
                </div>
              </div>
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
