// src/hooks/useInventoryAudit.ts
import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventory.service';
import { ingredientsService } from '../services/ingredient.service'; // Corrected import name
import type { AuditIngredient, StockAudit } from '../types/inventory';
import type { Ingredient } from '../types/ingtredient';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

export const useInventoryAudit = () => {
  const [auditIngredients, setAuditIngredients] = useState<AuditIngredient[]>([]);
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuth(); // Get token from AuthContext

  const fetchIngredientsForAudit = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const ingredients: Ingredient[] = await ingredientsService.getAll(token); // Pass token
      const initialAuditIngredients: AuditIngredient[] = ingredients.map(ing => ({
        ...ing,
        physicalStock: '', // Initialize physical stock as empty for user input
        difference: 0,
        financialImpact: 0,
      }));
      setAuditIngredients(initialAuditIngredients);
    } catch (err) {
      setError('Failed to fetch ingredients for audit.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Depend on token

  useEffect(() => {
    fetchIngredientsForAudit();
  }, [fetchIngredientsForAudit]);

  const handlePhysicalStockChange = useCallback((ingredientId: number, value: string) => {
    setAuditIngredients(prevIngredients =>
      prevIngredients.map(ing => {
        if (ing.id === ingredientId) {
          const physicalStock = value === '' ? '' : parseFloat(value);
          const theoreticalStock = ing.quantityInStock ?? 0;
          const difference = typeof physicalStock === 'number' ? physicalStock - theoreticalStock : 0;
          // Assuming unitCost is available on the ingredient or can be fetched
          // For now, let's use a placeholder or assume it's part of the ingredient object
          const unitCost = ing.lots && ing.lots.length > 0 ? ing.lots[0].unitCost : 0; // Simplistic: use first lot's cost
          const financialImpact = difference * unitCost;

          return {
            ...ing,
            physicalStock,
            difference,
            financialImpact,
          };
        }
        return ing;
      })
    );
  }, []);

  const submitAudit = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found.');
      return false;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const auditLines = auditIngredients
        .filter(ing => typeof ing.physicalStock === 'number' && ing.physicalStock >= 0) // Only submit valid entries
        .map(ing => ({
          ingredientId: ing.id,
          physicalStock: ing.physicalStock as number,
          theoreticalStock: ing.quantityInStock ?? 0,
          unitCostAtAudit: ing.lots && ing.lots.length > 0 ? ing.lots[0].unitCost : 0, // Simplistic
        }));

      if (auditLines.length === 0) {
        setError('No hay ingredientes válidos para auditar.');
        setIsSubmitting(false);
        return false;
      }

      const auditData: StockAudit = {
        observations,
        auditLines,
      };

      await inventoryService.postStockAudit(auditData); // Token is handled by api.ts for inventoryService
      // Optionally refetch ingredients to update theoretical stock after audit
      await fetchIngredientsForAudit();
      setObservations(''); // Clear observations after successful submission
      return true;
    } catch (err) {
      setError('Failed to submit audit.');
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [auditIngredients, observations, fetchIngredientsForAudit, token]); // Depend on token

  return {
    auditIngredients,
    observations,
    setObservations,
    isLoading,
    error,
    isSubmitting,
    fetchIngredientsForAudit,
    handlePhysicalStockChange,
    submitAudit,
  };
};
