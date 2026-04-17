import { useState, useCallback } from 'react';
import { menuPlanningService } from '../services/menu.planning.service';
import { Menu, CreateMenuDto, UpdateMenuDto, AddMenuOptionDto } from '../types/menu-planning';

export const useMenuPlanning = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuPlanningService.getAll();
      setMenus(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching menus');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPublishedMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuPlanningService.getPublished();
      setMenus(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching published menus');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenu = async (data: CreateMenuDto) => {
    setLoading(true);
    setError(null);
    try {
      await menuPlanningService.create(data);
      await fetchMenus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating menu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMenu = async (id: string, data: UpdateMenuDto) => {
    setLoading(true);
    setError(null);
    try {
      await menuPlanningService.update(id, data);
      await fetchMenus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating menu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMenu = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await menuPlanningService.delete(id);
      await fetchMenus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting menu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMenuOption = async (data: AddMenuOptionDto) => {
    setLoading(true);
    setError(null);
    try {
      await menuPlanningService.addOption(data);
      await fetchMenus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding menu option');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    menus,
    loading,
    error,
    fetchMenus,
    fetchPublishedMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    addMenuOption
  };
};
