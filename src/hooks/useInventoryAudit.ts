// src/hooks/useInventoryAudit.ts
import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventory.service';
import { ingredientsService } from '../services/ingredient.service';
import { menuItemsService } from '../services/menu.items.service';
import type { StockAuditPayload, AuditType, AuditableItem, AuditIngredient, AuditMenuItem } from '../types/inventory';
import type { Ingredient } from '../types/ingtredient';
import type { MenuItem } from '../types/menu';
import { useAuth } from '../contexts/AuthContext';

export const useInventoryAudit = (auditType: AuditType) => {
  const [auditableItems, setAuditableItems] = useState<AuditableItem[]>([]);
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuth();

  const fetchItemsForAudit = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let items: AuditableItem[];
      if (auditType === 'ingredient') {
        const ingredients: Ingredient[] = await ingredientsService.getAll(token);
        items = ingredients.map((ing): AuditIngredient => ({
          ...ing,
          quantityInStock: ing.lots.reduce((sum, lot) => sum + lot.quantity, 0),
          physicalStock: '',
          difference: 0,
          financialImpact: 0,
        }));
      } else {
        const menuItems: MenuItem[] = await menuItemsService.getAll();
        items = menuItems
          .filter(item => item.isActive && item.type === 'SIMPLE') // Filter out inactive and compound items
          .map((item): AuditMenuItem => ({
            ...item,
            quantityInStock: item.lots.reduce((sum, lot) => sum + lot.quantity, 0),
            physicalStock: '',
            difference: 0,
            financialImpact: 0,
          }));
      }
      setAuditableItems(items);
    } catch (err) {
      setError(`Failed to fetch ${auditType}s for audit.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, auditType]);

  useEffect(() => {
    fetchItemsForAudit();
  }, [fetchItemsForAudit]);

  const handlePhysicalStockChange = useCallback((itemId: number, value: string) => {
    setAuditableItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const physicalStock = value === '' ? '' : parseFloat(value);
          const theoreticalStock = item.quantityInStock ?? 0;
          const difference = typeof physicalStock === 'number' ? physicalStock - theoreticalStock : 0;
          
          let unitCost = 0;
          if ('lots' in item && item.lots && item.lots.length > 0) { // Ingredient
            unitCost = item.lots[0].unitCost;
          } else if ('cost' in item && item.cost) { // MenuItem
            unitCost = item.cost;
          }

          const financialImpact = difference * unitCost;

          return {
            ...item,
            physicalStock,
            difference,
            financialImpact,
          };
        }
        return item;
      })
    );
  }, []);

  const submitAudit = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found.');
      return false;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const itemsToAudit = auditableItems
        .filter(item => typeof item.physicalStock === 'number' && !isNaN(item.physicalStock) && item.physicalStock >= 0);

      if (itemsToAudit.length === 0) {
        setError(`No valid ${auditType}s to audit.`);
        setIsSubmitting(false);
        return false;
      }

      const backendAuditType: AuditType = auditType === 'ingredient' ? 'ingredient' : 'menu_item';

      // Make individual API calls for each audited item
      const auditPromises = itemsToAudit.map(async (item) => {
        const payload: StockAuditPayload = {
          auditType: backendAuditType,
          physicalStock: item.physicalStock as number,
          observations: observations || undefined, // Send observations if not empty
        };

        if (auditType === 'ingredient') { // Use 'INGREDIENT' directly as it's the backend enum value
          if (typeof item.id === 'number') {
            payload.ingredientId = item.id;
          } else {
            console.error('Invalid ingredient ID:', item.id);
            throw new Error('Invalid ingredient ID encountered during audit submission.');
          }
        } else { // auditType === 'MENU_ITEM'
          if (typeof item.id === 'number') {
            payload.menuItemId = item.id;
          } else {
            console.error('Invalid menu item ID:', item.id);
            throw new Error('Invalid menu item ID encountered during audit submission.');
          }
        }

        console.log('Sending audit payload:', payload); // Add this line for debugging
        await inventoryService.postStockAudit(payload);
      });

      await Promise.all(auditPromises);

      await fetchItemsForAudit(); // Refetch to clear the form and show fresh data
      setObservations(''); // Clear observations after successful submission
      return true;
    } catch (err) {
      setError('Failed to submit audit.');
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [auditableItems, observations, fetchItemsForAudit, token, auditType]);

  return {
    auditableItems,
    observations,
    setObservations,
    isLoading,
    error,
    isSubmitting,
    handlePhysicalStockChange,
    submitAudit,
  };
};