import api from './api';
import type { Observation } from '../types/observation';

export const getObservations = async (): Promise<Observation[]> => {
  const response = await api.get<Observation[]>('/observations');
  return response.data;
};
