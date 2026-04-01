// src/services/production.service.ts
import api from './api';
import { type Ingredient } from '../types/ingtredient';

export enum PickingListStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface PickingListItem {
  id: number;
  pickingListId: number;
  ingredientId: number;
  ingredient: Ingredient; // Include full ingredient details
  requiredQuantity: number;
  pickedQuantity: number;
}

export interface PickingList {
  id: number;
  date: string; // YYYY-MM-DD
  status: PickingListStatus;
  companyId: string;
  pickingListItems: PickingListItem[];
}

const getPickingListByDate = async (date: string): Promise<PickingList> => {
  const response = await api.get<PickingList>(`/production/picking-lists/${date}`);
  return response.data;
};

const triggerProductionPlanManual = async (date: string): Promise<any> => {
  const response = await api.post(`/production/trigger-plan-manual/${date}`);
  return response.data;
};

export const productionService = {
  getPickingListByDate,
  triggerProductionPlanManual,
};