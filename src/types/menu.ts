// src/types/menu.ts
import type { Ingredient, IngredientLot } from './ingtredient';
import type { NutritionalInfo } from './nutritionalInfo';

export interface Category {
  id: number;
  companyId: string | null;
  name: string;
  description: string | null;
  createdAt: string; // suele llegar como string ISO
}



export interface RecipeIngredientRelation {
  id: number;
  quantity: number;
  ingredient: Ingredient;        // se importará desde /types/ingredient
}

export interface MenuItem {
  id: number;
  name: string;
  stock?: number; // Backend might still send this, but quantityInStock is the source of truth
  quantityInStock: number; // Calculated field: sum of lots' quantities
  iconName: string | null;
  cost: number | null;
  category: Category | null;
  minStock: number | null;
  isActive: boolean;
  maxOrder: number | null;
  type: 'SIMPLE' | 'COMPUESTO';
  lots: IngredientLot[]; // For SIMPLE items
  recipeIngredients: RecipeIngredientRelation[]; // For COMPUESTO items
  nutritionalInfo?: NutritionalInfo;
}


export interface MenuItemCreate {
  name: string;
  minStock?: number;
  maxOrder?: number;
  categoryId?: number;
  iconName?: string;
  type: 'SIMPLE' | 'COMPUESTO';
}

export interface MenuItemUpdate {
  name?: string;
  minStock?: number;
  maxOrder?: number;
  categoryId?: number;
  iconName?: string;
  isActive?: boolean;
  type?: 'SIMPLE' | 'COMPUESTO';
}
