// src/types/waste.ts

import type { Ingredient, IngredientLot } from './ingtredient';
import type { User } from './user'; // Assuming a user type exists

export enum WasteReason {
  SOBRANTE_LINEA = 'sobrante_linea',
  ERROR_COCCION = 'error_coccion',
  VENCIMIENTO = 'vencimiento',
  MERMA_PREPARACION = 'merma_preparacion',
  DAÑADO = 'dañado',
  OTRO = 'otro',
}

export const wasteReasonLabels: Record<WasteReason, string> = {
  [WasteReason.SOBRANTE_LINEA]: 'Sobrante de línea',
  [WasteReason.ERROR_COCCION]: 'Error de cocción',
  [WasteReason.VENCIMIENTO]: 'Vencimiento',
  [WasteReason.MERMA_PREPARACION]: 'Merma por preparación',
  [WasteReason.DAÑADO]: 'Producto dañado',
  [WasteReason.OTRO]: 'Otro',
};


export interface CreateWasteLogDto {
  ingredientId: number;
  quantity: number;
  reason: WasteReason;
  notes?: string;
  logDate: string;
}

export interface WasteLog {
  id: number;
  quantity: number;
  reason: WasteReason;
  notes?: string;
  createdAt: string; // ISO Date string
  user: User;
  ingredientLot: IngredientLot;
}
