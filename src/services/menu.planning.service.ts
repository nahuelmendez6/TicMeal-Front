import api from './api';
import { Menu, CreateMenuDto, UpdateMenuDto, AddMenuOptionDto } from '../types/menu-planning';

export const menuPlanningService = {
  getAll: async (): Promise<Menu[]> => {
    const response = await api.get('/menus');
    return response.data;
  },

  getById: async (id: string): Promise<Menu> => {
    const response = await api.get(`/menus/${id}`);
    return response.data;
  },

  getPublished: async (): Promise<Menu[]> => {
    const response = await api.get('/menus/published');
    return response.data;
  },

  create: async (data: CreateMenuDto): Promise<Menu> => {
    const response = await api.post('/menus', data);
    return response.data;
  },

  update: async (id: string, data: UpdateMenuDto): Promise<Menu> => {
    const response = await api.patch(`/menus/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/menus/${id}`);
  },

  addOption: async (data: AddMenuOptionDto): Promise<any> => {
    const response = await api.post('/menus/options', data);
    return response.data;
  }
};
