import { useState, useCallback } from "react";
import { menuItemsService } from "../services/menu.items.service";
import type { MenuItem } from "../types/menu";

export const useMenuItems = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false); // Opcional: para manejar estados de carga

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await menuItemsService.getAll();
      const processedData = data.map((item: MenuItem) => ({
        ...item,
        quantityInStock: item.lots ? item.lots.reduce((sum, lot) => sum + lot.quantity, 0) : 0,
      }));
      setItems(processedData.filter((i: MenuItem) => i.isActive));
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (data: any) => {
    const item = await menuItemsService.create(data);
    await fetchItems();
    return item;
  };

  const updateItem = async (id: number, data: any) => {
    const item = await menuItemsService.update(id, data);
    await fetchItems();
    return item;
  };

  const deleteItem = async (id: number) => {
    await menuItemsService.softDelete(id);
    await fetchItems();
  };

  return {
    items,
    loading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};