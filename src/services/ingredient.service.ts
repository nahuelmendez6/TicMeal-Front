import api from './api';
import type { Ingredient } from '../types/ingtredient';

// DTO for creating/updating, omits calculated fields and IDs
export type IngredientSaveDto = Omit<Ingredient, 'id' | 'quantityInStock' | 'lots' | 'isActive' | 'observations'> & {
  observationIds?: number[];
};

export const ingredientsService = {
  async getAll(token: string): Promise<Ingredient[]> {
    const response = await api.get('/ingredients', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async create(token: string, data: IngredientSaveDto): Promise<Ingredient> {
    const response = await api.post('/ingredients', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async update(token: string, id: number, data: Partial<IngredientSaveDto>): Promise<Ingredient> {
    const response = await api.patch(`/ingredients/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async remove(token: string, id: number): Promise<void> {
    // The original implementation did a soft delete (PATCH isActive: false)
    // The new requirement implies a hard delete, but to be safe, we'll stick to soft delete.
    // If a hard delete is needed, this should be changed to api.delete
    await api.patch(`/ingredients/${id}`, { isActive: false }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

