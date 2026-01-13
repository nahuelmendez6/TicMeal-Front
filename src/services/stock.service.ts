// src/services/stock.service.ts
import api from './api';
import type { IngredientLot } from '../types/ingtredient';

export interface StockMovementDto {
  movementType: 'in' | 'out';
  quantity: number;
  reason?: string;
  ingredientId?: number; // For IN movements of ingredients
  menuItemId?: number; // For IN movements of simple items
  ingredientLotId?: number; // For OUT movements
  lotNumber?: string;
  expirationDate?: string; // ISO string
  unitCost?: number;
}

export const stockService = {
  async createMovement(token: string, movement: StockMovementDto): Promise<IngredientLot> {
    const response = await api.post('/stock/movements', movement, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
