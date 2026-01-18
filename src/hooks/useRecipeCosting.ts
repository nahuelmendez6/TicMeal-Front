// src/hooks/useRecipeCosting.ts
import { useState, useCallback } from 'react';
import { recipeService } from '../services/recipe.service';
import type { RecipeCosting } from '../types/recipe';

export const useRecipeCosting = () => {
  const [recipeCosting, setRecipeCosting] = useState<RecipeCosting | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeCosting = useCallback(async (menuItemId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await recipeService.getRecipeTheoreticalCost(menuItemId);
      setRecipeCosting(data);
    } catch (err) {
      setError('Failed to fetch recipe costing.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    recipeCosting,
    isLoading,
    error,
    fetchRecipeCosting,
  };
};
