// src/services/waste.service.ts
import api from './api';
import type { CreateWasteLogDto, WasteLog } from '../types/waste';

const BASE_URL = '/waste';

export const wasteService = {
  /**
   * Get the waste log history for the company.
   */
  getWasteLogs: async (): Promise<WasteLog[]> => {
    const { data } = await api.get<WasteLog[]>(BASE_URL);
    return data;
  },

  /**
   * Creates a new waste log entry.
   * This will also trigger a stock movement.
   * @param wasteData - The data for the new waste log.
   */
  createWasteLog: async (wasteData: CreateWasteLogDto): Promise<WasteLog> => {
    const { data } = await api.post<WasteLog>(BASE_URL, wasteData);
    return data;
  },
};
