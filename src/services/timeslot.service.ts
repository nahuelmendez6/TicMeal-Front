import api from './api';
import { Timeslot, CreateTimeslotDto, UpdateTimeslotDto } from '../types/reservation';

export const timeslotService = {
  getAll: async (): Promise<Timeslot[]> => {
    const response = await api.get('/timeslots');
    return response.data;
  },

  create: async (data: CreateTimeslotDto): Promise<Timeslot> => {
    const response = await api.post('/timeslots', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTimeslotDto): Promise<Timeslot> => {
    const response = await api.patch(`/timeslots/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/timeslots/${id}`);
  }
};
