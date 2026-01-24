import type { Ingredient } from './ingtredient';
import type { MenuItem } from './menu';

export type AuditType = 'ingredient' | 'menu_item';

// This is the type used by the current InventoryAuditTable
export interface AuditIngredient extends Ingredient {
  physicalStock: number | '';
  difference: number;
  financialImpact: number;
}

// A new type for menu item audits
export interface AuditMenuItem extends MenuItem {
  physicalStock: number | '';
  difference: number;
  financialImpact: number;
}

// A generic auditable item
export type AuditableItem = AuditIngredient | AuditMenuItem;

// The payload for the audit submission (matches CreateStockAuditDto)
export interface StockAuditPayload {
  auditType: AuditType;
  ingredientId?: number;
  menuItemId?: number;
  physicalStock: number;
  observations?: string;
}
