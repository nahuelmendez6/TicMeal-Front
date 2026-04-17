import api from './api';
import type { Timeslot, CreateTimeslotDto, UpdateTimeslotDto } from '../types/reservation';

export const timeslotService = {
  getAll: async (companyId: number): Promise<Timeslot[]> => {
    const response = await api.get(`/companies/${companyId}/timeslots`);
    return response.data;
  },

  create: async (companyId: number, data: CreateTimeslotDto): Promise<Timeslot> => {
    const response = await api.post(`/companies/${companyId}/timeslots`, data);
    return response.data;
  },

  update: async (companyId: number, id: string, data: UpdateTimeslotDto): Promise<Timeslot> => {
    // Assuming the update endpoint also follows the company prefix or is direct
    const response = await api.patch(`/companies/${companyId}/timeslots/${id}`, data);
    return response.data;
  },

  delete: async (companyId: number, id: string): Promise<void> => {
    await api.delete(`/companies/${companyId}/timeslots/${id}`);
  }
};
