// src/services/inventory.service.ts
import api from './api';
import type { StockAuditPayload } from '../types/inventory';

const BASE_URL = '/stock';

export const inventoryService = {
  /**
   * Submits a new stock audit.
   * @param auditData - The complete audit data, including observations and all line items.
   */
  postStockAudit: async (auditData: StockAuditPayload): Promise<void> => {
    await api.post(`${BASE_URL}/audit`, auditData);
  },
};
