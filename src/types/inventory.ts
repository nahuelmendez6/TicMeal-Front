// src/types/inventory.ts

import { Ingredient } from './ingtredient';

/**
 * Represents a single line item within a stock audit.
 */
export interface StockAuditLine {
  ingredientId: number;
  physicalStock: number;
  theoreticalStock: number;
  unitCostAtAudit: number; // Cost of the ingredient at the moment of the audit
}

/**
 * Represents the complete stock audit payload to be sent to the backend.
 */
export interface StockAudit {
  observations: string;
  auditLines: StockAuditLine[];
}

/**
 * Represents an ingredient prepared for the audit view, including calculated fields.
 */
export interface AuditIngredient extends Ingredient {
  physicalStock: number | ''; // User input
  difference: number;
  financialImpact: number;
}

/**
 * Represents the data for the inventory variance report.
 */
export interface InventoryVariance {
  auditId: number;
  auditDate: string;
  userName: string;
  observations: string;
  totalVarianceValue: number;
  adjustments: Array<{
    ingredientName: string;
    lotNumber: string;
    quantityAdjusted: number;
    costImpact: number;
  }>;
}
