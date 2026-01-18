// src/types/recipe.ts

/**
 * Represents the detailed cost breakdown of a menu item recipe.
 */
export interface RecipeCosting {
  menuItemId: number;
  menuItemName: string;
  totalCost: number;
  ingredients: RecipeCostingIngredient[];
}

/**
 * Represents a single ingredient within the recipe cost breakdown.
 */
export interface RecipeCostingIngredient {
  ingredientId: number;
  name: string;
  /**
   * The quantity required for the recipe *before* accounting for shrinkage (gross weight).
   * This is the weight you need to start with.
   */
  grossQuantity: number;
  /**
   * The final quantity used in the recipe *after* preparation (net weight).
   */
  netQuantity: number;
  /**
   * The unit of measurement for the ingredient.
   */
  unit: string;
  /**
   * The total cost of this ingredient for the recipe, based on FIFO lot cost.
   */
  cost: number;
  /**
   * The shrinkage percentage applied.
   */
  shrinkagePercentage: number;
}