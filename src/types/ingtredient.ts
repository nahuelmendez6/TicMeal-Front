// src/types/ingredient.ts

export interface IngredientLot {
  id: number;
  lotNumber: string;
  expirationDate: string; // ISO date string
  quantity: number;
  unitCost: number;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  quantityInStock: number; // Calculated field
  minStock?: number;
  shrinkagePercentage?: number;
  companyId: string | null;
  lots: IngredientLot[];
  isActive?: boolean;
}

export interface RecipeIngredient {
  id: number;
  quantity: number;
  ingredient: Ingredient;
}
