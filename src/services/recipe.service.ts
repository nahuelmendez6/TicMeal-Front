// src/services/recipe.service.ts
import api from './api';
import type { RecipeCosting } from '../types/recipe';

const BASE_URL = '/stock/menu-item';

export const recipeService = {
  /**
   * Fetches the theoretical cost breakdown for a specific menu item.
   * @param menuItemId - The ID of the menu item.
   */
  getRecipeTheoreticalCost: async (menuItemId: number): Promise<RecipeCosting> => {
    const { data } = await api.get<RecipeCosting>(`${BASE_URL}/${menuItemId}/theoretical-cost`);
    return data;
  },
};
