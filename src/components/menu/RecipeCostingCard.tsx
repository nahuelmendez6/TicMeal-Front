// src/components/menu/RecipeCostingCard.tsx
import React, { useEffect } from 'react';
import { useRecipeCosting } from '../../hooks/useRecipeCosting';
import type { RecipeCostingIngredient } from '../../types/recipe';

interface RecipeCostingCardProps {
  menuItemId: number;
}

const RecipeCostingCard: React.FC<RecipeCostingCardProps> = ({ menuItemId }) => {
  const { recipeCosting, isLoading, error, fetchRecipeCosting } = useRecipeCosting();

  useEffect(() => {
    if (menuItemId) {
      fetchRecipeCosting(menuItemId);
    }
  }, [menuItemId, fetchRecipeCosting]);

  if (isLoading) {
    return (
      <div className="card mb-3">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando costo...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      </div>
    );
  }

  if (!recipeCosting) {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <div className="alert alert-info mb-0">Seleccione un ítem del menú para ver su escandallo.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Escandallo: {recipeCosting.menuItemName}</h5>
        <h4 className="mb-0">Costo Total: ${recipeCosting.totalCost.toFixed(2)}</h4>
      </div>
      <div className="card-body">
        <p className="text-muted small">
          *Costo calculado usando el método FIFO con los lotes de ingredientes disponibles.
        </p>
        <h6>Desglose de Ingredientes:</h6>
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Ingrediente</th>
                <th>Peso Neto</th>
                <th>Peso Bruto</th>
                <th>Merma (%)</th>
                <th>Costo</th>
              </tr>
            </thead>
            <tbody>
              {recipeCosting.ingredients.map((ing: RecipeCostingIngredient) => (
                <tr key={ing.ingredientId}>
                  <td>{ing.name}</td>
                  <td>{ing.netQuantity.toFixed(2)} {ing.unit}</td>
                  <td>{ing.grossQuantity.toFixed(2)} {ing.unit}</td>
                  <td>{ing.shrinkagePercentage.toFixed(2)}%</td>
                  <td>${ing.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecipeCostingCard;
